import { getNetflixUsageToday, ensureUsagePermission } from '@/components/getUsage';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const [netflixMinutes, setNetflixMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const ok = await ensureUsagePermission();
        if (!ok) {
          setError('Usage access permission not granted. Open Settings to enable it.');
          return;
        }

        const usage = await getNetflixUsageToday();

        if (!usage) {
          setNetflixMinutes(null);
        } else {
          setNetflixMinutes(usage.minutes);
        }
      } catch (err: any) {
        console.warn('Failed to load Netflix usage', err);
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: 80 + insets.top }]}>
      <Text style={styles.title}>Tab One</Text>
      <View style={{ marginTop: 16, alignItems: 'center' }}>
        {loading ? (
          <Text>Loading Netflix usage…</Text>
        ) : error ? (
          <Text>{`Error: ${error}`}</Text>
        ) : netflixMinutes === null ? (
          <Text>Netflix not used in the last 24 hours.</Text>
        ) : (
          <Text>{`Netflix usage (today): ${netflixMinutes} minute${netflixMinutes === 1 ? '' : 's'}`}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
