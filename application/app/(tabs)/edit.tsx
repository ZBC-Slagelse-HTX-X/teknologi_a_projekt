import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

{/* <Button title="Open Modal" onPress={() => router.push('/modal')} /> */}
export default function Edit() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  return (
        <View style={[styles.outer_container, { paddingTop: 80 + insets.top }]}>
          <View style={[styles.container, styles.container_1]}>
            <Text style={styles.title}>Rediger dit abonnoment her</Text>
          </View>
          
          {/* Nuværende abonnomenter */}
          <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20}}>
              <View style={styles.container_2}>
                <Text>Netflix: 100kr</Text>
              </View>
              <View>
                <Pressable style={styles.buttonStyle}><Text style={{fontSize: 12}}>Opsig</Text></Pressable>
              </View>
            </View>
          </View>
          
          <View style={styles.container}>
            <Text style={styles.title}>Mere data kommer snart...</Text>
          </View>
    
          <View style={[styles.container, styles.container_3]}>
              <Pressable style={styles.analyesButtonStyle} onPress={() => alert('Køb Ny Analyse')}>
                <Text style={[{fontSize: 20}]}>Køb Ny Analyse</Text>
              </Pressable>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  outer_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
    width: '90%',
    marginBottom: 20,
    },
    container_1: {
      borderColor: '#000',
      backgroundColor: '#f0f0f0',
      padding: 10,
      alignItems: 'stretch',
    },
    container_2: {
      display: 'flex',
      justifyContent: "center",
    },
    container_3: {
      padding: 0,
      borderColor: '#fff',
    },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: '#000',  
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  analyesButtonStyle: {
    borderWidth: 1,
    borderColor: '#000',  
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    height: 50,
    padding: 0,
  },
});
