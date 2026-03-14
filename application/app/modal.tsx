import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Platform, View as RNView, StyleSheet } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <RNView style={{ marginTop: 20 }}>
        <Button title="Close" onPress={() => router.back()} />
      </RNView>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
