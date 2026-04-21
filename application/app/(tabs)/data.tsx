import LgStats from "@/components/lg_stats";
import Overview from "@/components/overview";
import { useSubscriptions } from '@/components/SubscriptionsContext';
import { Text, View } from '@/components/Themed';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Data() {
  const insets = useSafeAreaInsets();
  const { runAnalysis } = useSubscriptions();
  const scaleBtn = useSharedValue(1);
  const animatedModalBtn = useAnimatedStyle(() => ({
    transform: [{ scale: scaleBtn.value }],
  }));

  return (
    <View style={[styles.outer_container, { paddingTop: 80 + insets.top }]}>
      <View style={[styles.container, styles.container_1]}>
        <Overview></Overview>
      </View>
      
      <View style={[styles.container, styles.container_1]}>
        <LgStats />
      </View>
      
      <View style={styles.container}>
        <Text style={styles.title}>Mere data kommer snart...</Text>
      </View>

      <View style={[styles.container, styles.container_2]}>
          <Pressable 
            onPressIn={() => (scaleBtn.value = withSpring(0.96))}
            onPressOut={() => (scaleBtn.value = withSpring(1))}
            style={styles.buttonStyle} 
            onPress={() => runAnalysis()}
          >
            <Animated.View style={[styles.primaryBtn, animatedModalBtn]}>
              <Text style={styles.primaryText}>Køb Ny Analyse</Text>
            </Animated.View>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    primaryBtn: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },

  outer_container: {
    flex: 1,
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
    container_2: {
      borderColor: '#fff',
      padding: 0,
    },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {    
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    borderRadius: 5,
    padding: 0,
  },
    primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
