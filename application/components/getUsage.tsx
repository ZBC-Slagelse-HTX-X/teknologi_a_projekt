import * as UsageStats from 'expo-android-usagestats';
import { Alert, Linking, Platform } from 'react-native';


export async function ensureUsagePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const has = await UsageStats.hasUsageStatsPermission();
    if (has) return true;

    await UsageStats.requestUsageStatsPermission();

    const hasAfter = await UsageStats.hasUsageStatsPermission();
    if (hasAfter) return true;

    Alert.alert(
      'Usage access required',
      'This feature needs Android Usage Access to read app foreground times. Open settings to grant access?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
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


export async function getUsageForPackage(packageName: string, days = 1): Promise<
  { totalTimeInForeground: number; minutes: number } | null
> {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  const stats = await UsageStats.getUsageStats(start, end);
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

  const totalMs = matches.reduce((acc: number, s: any) => acc + (Number(getMs(s)) || 0), 0);

  if (totalMs === 0) {
    console.log(`getUsageForPackage: matched entries for '${packageName}' but totalMs==0 for ${days} day(s). Matches:`);
    matches.forEach((m: any, i: number) => console.log(i, m.packageName, getMs(m), m));
  }

  const minutes = Math.round(totalMs / 60000);
  return { totalTimeInForeground: totalMs, minutes };
}
