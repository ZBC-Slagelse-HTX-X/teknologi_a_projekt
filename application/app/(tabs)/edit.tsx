import { useSubscriptions } from '@/components/SubscriptionsContext';
import { Text, View } from '@/components/Themed';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Edit() {
  const [modal, setModal] = useState(false);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { addSubscription, subscriptions, removeSubscription } = useSubscriptions();

  const scale = useSharedValue(1);
  const scaleBtn = useSharedValue(1);

  const animatedMain = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedModalBtn = useAnimatedStyle(() => ({
    transform: [{ scale: scaleBtn.value }],
  }));

  const createSubscription = () => {
    if (!name || !price) return;

    const lower = name.trim().toLowerCase();

    if (lower.includes("youtube")) {
      addSubscription({
        id: Date.now().toString(),
        name,
        type: "Custom",
        price: Number(price),
        billing_cycle: billing,
        time_used: 0,
        packageName: "com.google.android.youtube",
      } as any);

      setName("");
      setPrice("");
      setModal(false);
      return;
    }

    Alert.alert(
      "Ikke understøttet",
      "Dette abonnement er endnu ikke understøttet."
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 80,}]}>
      
      {/* Title */}
      <Text style={[styles.title, { "borderRadius": 10, "backgroundColor": "#f0f0f0", "width": "100%", "padding": 15, "textAlign": "center"}]}>Rediger dine abonnementer</Text>

    
      {/* Subscriptions list */}
      <View style={{"backgroundColor": "#f0f0f0", "padding": 10, "borderRadius": 10}}>
        {subscriptions.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text>{s.name}: {s.price}kr</Text>
            <Pressable
              style={styles.smallButton}
              onPress={() =>
                Alert.alert(
                  'Opsig abonnement',
                  `Vil du opsige ${s.name}?`,
                  [
                    { text: 'Annuller', style: 'cancel' },
                    { text: 'Opsig', style: 'destructive', onPress: () => removeSubscription(s.id) },
                  ]
                )
              }
            >
              <Text style={styles.smallButtonText}>Opsig</Text>
            </Pressable>
          </View>
        ))}
      </View>
      {/* Create button */}
      <Pressable
        style={{"width": "100%", "marginTop": 15}}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => setModal(true)}
      >
        <Animated.View style={[styles.primaryBtn, animatedMain]}>
          <Text style={styles.primaryText}>Opret abonnement</Text>
        </Animated.View>
      </Pressable>

      {/* Modal */}
      {modal && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nyt abonnement</Text>
              <Pressable onPress={() => setModal(false)}>
                <AntDesign name="close" size={20} color="#555" />
              </Pressable>
            </View>

            {/* Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Navn"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Pris (DKK)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            {/* Dropdown */}
            <Pressable
              style={styles.dropdown}
              onPress={() => setOpenDropdown(!openDropdown)}
            >
              <Text>
                {billing === "monthly" ? "Månedlig" : "Årlig"}
              </Text>
            </Pressable>

            {openDropdown && (
              <View style={styles.dropdownMenu}>
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setBilling("monthly");
                    setOpenDropdown(false);
                  }}
                >
                  <Text>Månedlig</Text>
                </Pressable>

                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setBilling("yearly");
                    setOpenDropdown(false);
                  }}
                >
                  <Text>Årlig</Text>
                </Pressable>
              </View>
            )}
            
            {/* Submit */}
            <Pressable
              onPressIn={() => (scaleBtn.value = withSpring(0.96))}
              onPressOut={() => (scaleBtn.value = withSpring(1))}
              onPress={createSubscription}
            >
              <Animated.View style={[styles.primaryBtn, animatedModalBtn]}>
                <Text style={styles.primaryText}>Opret</Text>
              </Animated.View>
            </Pressable>

          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  smallButton: {
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  smallButtonText: {
    fontSize: 12,
    color: "#fff",
  },

  primaryBtn: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  dropdown: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },

  dropdownItem: {
    padding: 12,
  },
});