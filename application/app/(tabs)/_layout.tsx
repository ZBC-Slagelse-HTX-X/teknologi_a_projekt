import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
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

          // This is the key: make the native tab bar completely invisible
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

        // Fully custom tabBar component
        tabBar={({ state, descriptors, navigation }) => {
          const focusedIndex = state.index;

          return (
            <BlurView
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              intensity={80}
              style={[
                styles.floatingTabBar,
                {
                  top: insets.top + 12, // safe area + a little breathing room
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
                      // @ts-ignore – accessibility props exist
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      onTouchEnd={onPress}
                    >
                      {options.tabBarIcon?.({ color: isFocused ? tintColor : '#8e8e93', focused: isFocused, size: 26 })}
                      {options.title && (
                        <View style={styles.label}>
                          {/* You can render text here if you want labels under icons */}
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
        {/* Your screens */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Text style={[
                styles.tabText,
                { color: focused ? tintColor : '#8e8e93' }
              ]}>
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="edit"
          options={{
            title: 'Edit',
            tabBarIcon: ({ focused }) => (
              <Text style={[
                styles.tabText,
                { color: focused ? tintColor : '#8e8e93' }
              ]}>
                Edit
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            tabBarIcon: ({ focused }) => (
              <Text style={[
                styles.tabText,
                { color: focused ? tintColor : '#8e8e93' }
              ]}>
                Data
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <Text style={[
                styles.tabText,
                { color: focused ? tintColor : '#8e8e93' }
              ]}>
                Profile
              </Text>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Floating pill-style tab bar
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
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingVertical: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 8,
    // marginHorizontal: 8,
  },

  tabItemActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  label: {
    marginTop: 4,
  },

  // Centered text style
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    padding:13,
  },
});
