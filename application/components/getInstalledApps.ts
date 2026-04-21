import { Platform } from 'react-native';

// Try to import UsageStats only when running on Android and when available.
let UsageStats: any | null = null;
if (Platform.OS === 'android') {
  try {
    // optional dependency already used in the repo
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    UsageStats = require('expo-android-usagestats');
  } catch (e) {
    UsageStats = null;
  }
}

export interface AppInfo {
  packageName: string;
  appName: string;
  icon: string; // data-uri or URL when available, empty string otherwise
  category: string; // best-effort, may be 'unknown'
}

/**
 * Return a list of installed apps.
 * Strategy:
 * 1. If a native "installed apps" library is available (common community modules), use it.
 * 2. Otherwise on Android fall back to listing packages seen in UsageStats (best-effort, not a full installed list).
 * 3. On iOS or when nothing is available, return an empty array.
 *
 * Note: For a complete, reliable installed-apps list you should add a native dependency
 * such as `react-native-get-installed-apps` (Android native) and rebuild the app.
 */
export async function getInstalledApps(): Promise<AppInfo[]> {
  // 1) Try known community modules (dynamically require so we don't crash when not installed)
  try {
    // try a few popular package names using static require calls so Metro can
    // analyze dependencies (dynamic require with a variable is rejected).
    let mod: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      mod = require('react-native-get-installed-apps');
    } catch (_) {
      mod = null;
    }

    if (!mod) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        mod = require('react-native-installed-apps');
      } catch (_) {
        mod = null;
      }
    }

    if (!mod) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        mod = require('react-native-app-list');
      } catch (_) {
        mod = null;
      }
    }

    if (mod) {
      // common API shapes: mod.getApps(), mod.getInstalledApps(), or default export
      const fn = mod.getApps ?? mod.getInstalledApps ?? mod.default?.getApps ?? mod.default?.getInstalledApps;
      if (typeof fn === 'function') {
        const raw: any[] = await fn();
        // Normalize returned items to AppInfo
        const apps: AppInfo[] = raw.map((a: any) => ({
          packageName: a.packageName ?? a.package ?? a.package_name ?? String(a.id ?? ''),
          appName: a.appName ?? a.app_name ?? a.name ?? a.label ?? (a.packageName ?? ''),
          icon: a.icon ?? a.appIcon ?? a.iconBase64 ?? '',
          category: a.category ?? 'unknown',
        }));
        return apps;
      }
    }
  } catch (err) {
    console.warn('Error trying to use native installed-apps module:', err);
  }

  // 2) Fallback for Android: use UsageStats to list packages seen in the last 30 days.
  if (Platform.OS === 'android' && UsageStats) {
    try {
      const end = Date.now();
      const start = end - 30 * 24 * 60 * 60 * 1000; // 30 days
      const stats = await UsageStats.getUsageStats(start, end);
      const map = new Map<string, AppInfo>();
      stats.forEach((s: any) => {
        const pkg = s.packageName ?? s.package ?? s.name;
        if (!pkg) return;
        if (!map.has(pkg)) {
          map.set(pkg, {
            packageName: pkg,
            appName: s.appName ?? pkg,
            icon: '',
            category: s.category ?? 'unknown',
          });
        }
      });
      return Array.from(map.values());
    } catch (err) {
      console.warn('Error using UsageStats fallback for installed apps:', err);
    }
  }

  // 3) Nothing available — return empty list (iOS or no modules available).
  return [];
}
