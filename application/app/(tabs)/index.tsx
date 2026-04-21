import { ensureUsagePermission, getUsageForPackage } from '@/components/getUsage';
import Overview from '@/components/overview';
import { useSubscriptions } from '@/components/SubscriptionsContext';
import { Text, View } from '@/components/Themed';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const { subscriptions } = useSubscriptions();
  const [usageMap, setUsageMap] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(subscriptions)
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const ok = await ensureUsagePermission();
      if (!ok) {
        setError('Usage access permission not granted. Open Settings to enable it.');
        return;
      }
      
      const results: Record<string, number | null> = {};
      await Promise.all(
        subscriptions.map(async (sub) => {
          if (!sub.packageName) {
            results[sub.id] = null;
            return;
          }
          try {
            const u = await getUsageForPackage(sub.packageName);
            results[sub.id] = u ? u.minutes : null;
          } catch (err) {
            console.warn('Error fetching usage for', sub.name, err);
            results[sub.id] = null;
          }
        })
      );
      setUsageMap(results);
    } catch (err: any) {
      console.warn('Failed to load usage', err);
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }, [subscriptions]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    load();
  }, [load]);

  const appState = useRef<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const handler = (nextState: AppStateStatus) => {
      if (appState.current !== 'active' && nextState === 'active') {
        setError(null);
        load();
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, [load]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.outer_container, { paddingTop: 80 + insets.top }]}>
      <View style={[styles.container]}>
        <Image source={require('@/assets/images/red_rounded.png')} style={{ width: 100, height: 100, marginTop: 20 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Velkommen til</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Subscription Pilot!!</Text>
      </View>

      <View style={[styles.container, styles.container_1]}>
        <Overview></Overview>
      </View>
      
      <View style={[styles.container, styles.container_1]}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Overblik over dit forbrug i dag:</Text>
        <View style={{ marginTop: 16, alignItems: 'center', backgroundColor: "transparent", width: "100%"}}>
          {loading ? (
            <Text>Indlæser forbrug...</Text>
          ) : error ? (
            <Text>{`Error: ${error}`}</Text>
          ) : (
            subscriptions.map((sub) => {
              const minutes = usageMap[sub.id];
              return (
                <View key={sub.id} style={{ padding: 10, borderRadius: 8, marginBottom: 4, width: "100%", justifyContent: "center", alignItems:"center" }}>
                  {minutes === null || minutes === undefined ? (
                    <Text>{`${sub.name}: Ikke brugt i de sidste 24 timer eller ingen packageName angivet.`}</Text>
                  ) : (
                    <Text>{`${sub.name}: ${minutes} minutter`}</Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer_container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '90%',
    marginBottom: 20,
    },
    container_1: {
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      padding: 10,
      alignItems: 'stretch',
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
