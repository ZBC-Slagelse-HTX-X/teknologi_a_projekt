import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Profile() {
  const insets = useSafeAreaInsets();
  
  return (
    <>
    <View style={[styles.container, { paddingTop: 80 + insets.top }]}>
        <Text>Profile niggerrr</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Redigér dine abonnementer her!</Text>
        </View>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
});