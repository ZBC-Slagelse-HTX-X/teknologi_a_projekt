import { useSubscriptions } from "@/components/SubscriptionsContext";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width;

// Build chart data from the shared `subscriptions` array. We use the
// subscription `price` as the numeric value for the pie chart. If you later
// add a dedicated usage field (e.g. minutes_used), switch to that.
const colorPalette = ["#83A7EA", "#32CD32", "#992011", "#F4A261", "#E76F51", "#2A9D8F", "#264653"];

// chart data will be built on render so runtime additions are reflected
// (see inside the component for the rebuild).

const chartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default function LgStats() {
  const { subscriptions } = useSubscriptions();

  // Rebuild chart data from context subscriptions so runtime additions
  // and analysis updates are reflected when this component re-renders.
  const chartData = subscriptions.map((s, i) => ({
    name: s.name,
    minutes_used: s.minutes_used ?? s.price,
    color: colorPalette[i % colorPalette.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  // sort a copy of the data so the list shows least-used subscriptions first
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
            accessor="minutes_used"
            backgroundColor="transparent"
            paddingLeft="39"
            center={[0, 0]}
            absolute
            hasLegend={false}
          />
      </View>
      <View style={styles.chartText}>
        <Text>Dine mindst brugte abonomenter:</Text>
        <FlatList
          data={sortedData}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => <Text style={styles.item}>- {item.name} ({item.minutes_used} minutter)</Text>}
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
  item: {
    
  }
});