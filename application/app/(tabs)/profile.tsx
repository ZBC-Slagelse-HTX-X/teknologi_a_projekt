import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons/";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Profile() {
  const scaleBtn = useSharedValue(1);
  const animatedModalBtn = useAnimatedStyle(() => ({
    transform: [{ scale: scaleBtn.value }],
  }));
  
  const insets = useSafeAreaInsets();
  const userExample = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  };

  return (
    <>
    <View style={[styles.outer_container, { paddingTop: 80 + insets.top }]}>
        <View style={styles.container}>
          <View style={styles.container_1}>
            <View style={styles.icon_text_container}>
              <Ionicons name="person-outline" size={20} />
              <Text style={{"marginLeft": 10}}>{userExample.name}</Text>
            </View>
            <View style={styles.icon_text_container}>
              <Ionicons name="mail-outline" size={20} />
              <Text style={{"marginLeft": 10}}>{userExample.email}</Text>
            </View>
            <View style={styles.icon_text_container}>
              <Ionicons name="call-outline" size={20} />
              <Text style={{"marginLeft": 10}}>{userExample.phone}</Text>
            </View>
          </View>

          <View style={styles.container_2}>
            <Pressable
              onPressIn={() => (scaleBtn.value = withSpring(0.96))}
              onPressOut={() => (scaleBtn.value = withSpring(1))}
              style={{"width": "100%"}}
            >
              <Animated.View style={[styles.primaryBtn, animatedModalBtn]}>
                <Text style={styles.primaryText}><Ionicons name="create-outline" size={20} />  Rediger Profil</Text>
              </Animated.View>
            </Pressable>
          </View>

          <View style={styles.container_1}>
            <Text style={styles.title}>Indstillinger</Text>
            <View style={styles.icon_text_container}>
              <Ionicons name="settings-outline" size={20} />
              <Text style={{"marginLeft": 10}}>Indstillinger kommer snart...</Text>
            </View>
          </View>
        </View>
        
    </View>
      <View style={{"width": "100%", "alignItems": "center", "justifyContent": "center", "paddingBottom": 30}}>
        <Image source={require('@/assets/images/red_rounded.png')} style={styles.image}/>
        <Text style={{ fontSize: 12, color: "#888" }}>© 2026 Subscription Pilot</Text>
        <Text style={{ fontSize: 12, color: "#888" }}>Alpha version 1.0.0</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outer_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {    
    width: '90%',
    marginBottom: 20,
  },
  container_1: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      textAlign: 'left',
      margin: 10,
      marginTop: 10,
  },
  container_2: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      marginTop: 10,
  },
  button: {
    width: '100%',
    height: "100%",
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon_text_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
    primaryBtn: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});