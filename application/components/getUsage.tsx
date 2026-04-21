import * as UsageStats from 'expo-android-usagestats';


import { Alert, Linking, Platform } from 'react-native';
import { getInstalledApps } from './getInstalledApps';

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
export async function getYoutubeUsageToday(): Promise<
  { totalTimeInForeground: number; minutes: number } | null
> {
  const end = Date.now();
  const start = end - 24 * 60 * 60 * 1000;

  try {
    const installed = await getInstalledApps();
    console.log('Installed apps (first 30):', installed.slice(0, 110).map(a => a.packageName));
  } catch (err) {
    console.warn('Error listing installed apps for debug:', err);
  }

  const stats = await UsageStats.getUsageStats(start, end);

  const youtube = stats.find((app) => app.packageName === 'com.google.android.youtube');
  const tv2play = stats.find((app) => app.packageName === "dk.tv2.tv2play");

  if (!youtube) {
    return null;
  }

  const ms = youtube.totalTimeInForeground ?? 0;

  const minutes = Math.round(ms / 60000);

  return { totalTimeInForeground: ms, minutes };
}

export async function getTv2UsageToday(): Promise<
  { totalTimeInForeground: number; minutes: number } | null
> {
  const end = Date.now();
  const start = end - 24 * 60 * 60 * 1000;

  try {
    const installed = await getInstalledApps();
    console.log('Installed apps (first 30):', installed.slice(0, 110).map(a => a.packageName));
  } catch (err) {
    console.warn('Error listing installed apps for debug:', err);
  }

  const stats = await UsageStats.getUsageStats(start, end);

  
  const tv2play = stats.find((app) => app.packageName === "dk.tv2.tv2play");

  if (!tv2play) {
    return null;
  }

  const ms = tv2play.totalTimeInForeground ?? 0;

  const minutes = Math.round(ms / 60000);

  return { totalTimeInForeground: ms, minutes };
}

/**
 * Generic: get usage for an arbitrary Android package name in the last 24 hours.
 */
export async function getUsageForPackage(packageName: string, days = 1): Promise<
  { totalTimeInForeground: number; minutes: number } | null
> {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;

  const stats = await UsageStats.getUsageStats(start, end);
  // Try to find all matching entries for this package (some devices/vendors
  // may return multiple entries or slightly different package name variants).
  const needle = packageName.toLowerCase();
  const matches = stats.filter((app) => {
    if (!app || !app.packageName) return false;
    const pn = String(app.packageName).toLowerCase();
    const an = String((app as any).appName ?? '').toLowerCase();
    return pn === needle || pn.includes(needle) || an.includes(needle);
  });

  if (!matches || matches.length === 0) {
    console.log(`getUsageForPackage: no usage-stats entries matched '${packageName}' for ${days} day(s). Top packages:`);
    stats.slice(0, 20).forEach((s: any, i: number) => {
      const pn = s.packageName ?? s.package ?? '(unknown)';
      const ms = (s as any).totalTimeInForeground ?? (s as any).totalTimeForeground ?? (s as any).totalForegroundTime ?? (s as any).totalTime ?? 0;
      console.log(i, pn, ms);
    });
    return null;
  }

  // Helper to extract a usable ms value from a usage stat entry.
  const getMs = (s: any) => {
    return (
      s.totalTimeInForeground ??
      s.totalTimeForeground ??
      s.totalForegroundTime ??
      s.totalTime ??
      s.totalTimeForegroundServiceUsed ??
      0
    );
  };

  // Sum ms across all matches (defensive).
  const totalMs = matches.reduce((acc: number, s: any) => acc + (Number(getMs(s)) || 0), 0);

  if (totalMs === 0) {
    console.log(`getUsageForPackage: matched entries for '${packageName}' but totalMs==0 for ${days} day(s). Matches:`);
    matches.forEach((m: any, i: number) => console.log(i, m.packageName, getMs(m), m));
  }

  const minutes = Math.round(totalMs / 60000);
  return { totalTimeInForeground: totalMs, minutes };
}
