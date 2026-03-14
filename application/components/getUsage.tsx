import * as UsageStats from 'expo-android-usagestats';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Ensure the app has Android Usage Access permission.
 * Tries to request it, then re-checks. If still not granted, returns false.
 * On denial, shows a simple alert offering to open system settings.
 *
 * Note: this API is Android-only. On other platforms the function resolves true.
 */
export async function ensureUsagePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const has = await UsageStats.hasUsageStatsPermission();
    if (has) return true;

    // Prompt the system settings screen for Usage Access
    await UsageStats.requestUsageStatsPermission();

    const hasAfter = await UsageStats.hasUsageStatsPermission();
    if (hasAfter) return true;

    // Still no permission — show an alert offering to open app settings
    Alert.alert(
      'Usage access required',
      'This feature needs Android Usage Access to read app foreground times. Open settings to grant access?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            // Fallback to opening app settings. Some devices will require the specific Usage Access settings screen.
            Linking.openSettings().catch(() => {});
          },
        },
      ]
    );

    return false;
  } catch (err) {
    console.warn('Error checking/requesting usage permission', err);
    return false;
  }
}

/**
 * Returns Netflix usage for the last 24 hours.
 * On Android only (requires Usage Access permission).
 *
 * @returns object with { totalTimeInForeground (ms), minutes } or null if Netflix was not used
 */
export async function getNetflixUsageToday(): Promise<
  { totalTimeInForeground: number; minutes: number } | null
> {
  const end = Date.now();
  const start = end - 24 * 60 * 60 * 1000;

  const stats = await UsageStats.getUsageStats(start, end);

  const netflix = stats.find((app) => app.packageName === 'com.netflix.mediaclient');

  if (!netflix) {
    // Netflix not used in the window
    return null;
  }

  const ms = netflix.totalTimeInForeground ?? 0;
  const minutes = Math.round(ms / 60000);

  return { totalTimeInForeground: ms, minutes };
}
