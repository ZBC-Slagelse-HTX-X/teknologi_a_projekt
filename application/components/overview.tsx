import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { useSubscriptions } from './SubscriptionsContext';


export default function Overview() {
    const { subscriptions } = useSubscriptions(); 

    const data = subscriptions.map((s,i) => ({
        name: s.name,
        price: s.price,
        timeUsedMonth: (s as any).minutes_used_month ?? s.time_used
    }))

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.header}>Overblik over dit forbrug de sidste 30 dage:</Text>
            {data.map((item, index) => (
                <View key={index} style={styles.listItem}>
                    <Text>{item.name}: {item.price}kr</Text>
                    <Text>{item.timeUsedMonth} min</Text>
                </View>
            ))}
            
        </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
    },

    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    baseText: {
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: 5,
    },
    listItem: {
        fontSize: 14,
        backgroundColor: "#fff",
        width: "100%",
        padding: 8,
        paddingHorizontal: 50,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        margin: 2,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }

    }
)