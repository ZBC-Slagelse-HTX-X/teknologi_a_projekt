import { useSubscriptions } from "@/components/SubscriptionsContext";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width;

const colorPalette = ["#83A7EA", "#32CD32", "#992011", "#F4A261", "#E76F51", "#2A9D8F", "#264653"];

const chartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default function LgStats() {
  const { subscriptions } = useSubscriptions();

  const totalMinutes = subscriptions.reduce(
    (acc, s) => acc + (s.minutes_used ?? s.price),
    0
  );

  const chartData = subscriptions.map((s, i) => {
    const minutes = s.minutes_used ?? s.price;
    const percentage = totalMinutes > 0 ? +( (minutes / totalMinutes) * 100 ).toFixed(1) : 0;
    return {
      name: s.name,
      minutes_used: minutes,
      percentage,
      color: colorPalette[i % colorPalette.length],
      legendFontColor: "#333",
      legendFontSize: 14,
    };
  });

  
  const sortedData = [...chartData].sort((a, b) => (a.minutes_used ?? 0) - (b.minutes_used ?? 0));

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <View>
              <PieChart
              data={chartData}
              width={Math.round(screenWidth * 0.4)}
              height={Math.round((screenWidth * 0.8) * 0.6)}
              chartConfig={chartConfig}
              accessor="percentage"
              backgroundColor="transparent"
              paddingLeft="39"
              center={[0, 0]}
              absolute
              hasLegend={false}
            />
      </View>
      <View style={styles.chartText}>
          <Text>Dine mindst brugte</Text>
          <Text>abonomenter:</Text>
          <FlatList
            data={sortedData}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={[styles.swatch, { backgroundColor: item.color }]} />
                <Text style={styles.item}>- {item.name} ({item.minutes_used} minutter)</Text>
              </View>
            )}
          />

      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Don't force a height or flex so the wrapper will size to the chart content.
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    // Make the wrapper take the full width of its parent (the parent uses 90%).
    width: Math.round(screenWidth * 0.9),
  },
  chartWrapper: {
    // width: '90%',*
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    // backgroundColor: '#f0f0f0',
  },
  chartText: {
    // backgroundColor: "rgba(0, 255, 0, 0.5)",
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  item: {
    fontSize: 14,
    color: '#333',
  }
});
