import { useSubscriptions } from '@/components/SubscriptionsContext';
import { Text, View } from '@/components/Themed';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Edit() {
  const [modal, setModal] = useState(false)
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { addSubscription, runAnalysis } = useSubscriptions();

  function createSubscription() {
    if (!name || !price || !billing) return;
    
    const newSub = {
      id: Date.now().toString(),
      name,
      type: "Custom",
      price: Number(price),
      billing_cycle: billing
    };
  
    // Add to the shared subscription state via context
    addSubscription(newSub);
  
    // reset inputs
    setName("");
    setPrice("");
    // setBilling("");
  
    setModal(false);
    console.log(name, price, billing)
}


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
            {modal ?
            <View style={{backgroundColor: "#f0f0f0", width: "90%", height: 300, position: "absolute", zIndex: 10, padding: 10}}>
              <Pressable onPress={() => setModal(false)}><Text style={{fontSize: 50,position:"absolute", right: 0}}><AntDesign name="close" size={18} color="black" /></Text></Pressable>
              
              <TextInput style={{marginTop: 40}}
                placeholder="Indtast abonomentnavn"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Indtast prisen"
                value={price}
                onChangeText={setPrice}
                keyboardType='numeric'
              />
              {/* Dropdown */}

              <View style={{ marginTop: 10 }}>
              <Pressable
                onPress={() => setOpenDropdown(prev => !prev)}
                style={{
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: "#fff"
                }}
              >
                <Text>
                  {billing === "monthly" ? "Månedlig" : "Årlig"}
                </Text>
              </Pressable>

              {/* Options */}
              {openDropdown && (
                <View
                  style={{
                    borderWidth: 1,
                    borderTopWidth: 0,
                    backgroundColor: "#fff"
                  }}
                >
                  <Pressable
                    style={{ padding: 10 }}
                    onPress={() => {
                      setBilling("monthly");
                      setOpenDropdown(false);
                    }}
                  >
                    <Text>Månedlig</Text>
                  </Pressable>

                  <Pressable
                    style={{ padding: 10 }}
                    onPress={() => {
                      setBilling("yearly");
                      setOpenDropdown(false);
                    }}
                  >
                    <Text>Årlig</Text>
                  </Pressable>
                </View>
              )}
            </View>


              <Pressable onPress={createSubscription} style={styles.analyesButtonStyle}><Text>Opret</Text></Pressable>
            </View>
            : <></>} 
            <Pressable style={styles.analyesButtonStyle} onPress={() => setModal(true)}>
              <Text>Opret</Text>
            </Pressable>
            
          </View>
    
          <View style={[styles.container, styles.container_3]}>
              <Pressable style={styles.analyesButtonStyle} onPress={() => runAnalysis()}>
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
