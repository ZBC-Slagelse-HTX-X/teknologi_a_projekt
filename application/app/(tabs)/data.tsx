import LgStats from "@/components/lg_stats";
import Overview from "@/components/overview";
import { useSubscriptions } from '@/components/SubscriptionsContext';
import { Text, View } from '@/components/Themed';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Data() {
  const insets = useSafeAreaInsets();
  const { runAnalysis } = useSubscriptions();

  return (
    <View style={[styles.outer_container, { paddingTop: 80 + insets.top }]}>
      <View style={[styles.container, styles.container_1]}>
        <Overview></Overview>
      </View>
      
      <View style={styles.container}>
        <LgStats />
      </View>
      
      <View style={styles.container}>
        <Text style={styles.title}>Mere data kommer snart...</Text>
      </View>

      <View style={[styles.container, styles.container_2]}>
          <Pressable style={styles.buttonStyle} onPress={() => runAnalysis()}>
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
    width: '90%',
    marginBottom: 20,
    },
    container_1: {
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
    borderWidth: 1,
    borderColor: '#000',  
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    height: 50,
    padding: 0,
  },
});
