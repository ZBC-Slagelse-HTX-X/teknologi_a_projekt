import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',

          tabBarStyle: { position: 'absolute', top: 0, left: 0, right: 0, height: 0, opacity: 0 },

          tabBarActiveTintColor: tintColor,
          tabBarInactiveTintColor: '#8e8e93',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          },
        }}

        tabBar={({ state, descriptors, navigation }) => {
          const focusedIndex = state.index;

          return (
            <BlurView
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              intensity={80}
              style={[
                styles.floatingTabBar,
                {
                  top: insets.top + 12,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255)',
                },
              ]}
            >
              <View style={styles.tabBarInner}>
                {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const isFocused = focusedIndex === index;

                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  };

                  return (
                    <View
                      key={route.key}
                      style={[
                        styles.tabItem,
                        isFocused && styles.tabItemActive,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      onTouchEnd={onPress}
                    >
                      {options.tabBarIcon?.({ color: isFocused ? tintColor : '#8e8e93', focused: isFocused, size: 26 })}
                      {options.title && (
                        <View style={styles.label}>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </BlurView>
          );
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? tintColor : '#8e8e93' },
                  ]}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="edit"
          options={{
            title: 'Edit',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? tintColor : '#8e8e93' },
                  ]}
                >
                  Edit
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? tintColor : '#8e8e93' },
                  ]}
                >
                  Data
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabContent, styles.tabContentWithIcon]}>
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? tintColor : '#8e8e93' },
                  ]}
                >
                  Profile
                </Text>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={focused ? tintColor : '#8e8e93'}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  floatingTabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabItemActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  label: {
    marginTop: 4,
  },

  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 8,
  },
  tabContentWithIcon: {
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
