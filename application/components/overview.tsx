import { Text, View } from '@/components/Themed';
import { FlatList, StyleSheet } from 'react-native';
import { useSubscriptions } from './SubscriptionsContext';


export default function Overview() {{
    const { subscriptions } = useSubscriptions(); 

    const data = subscriptions.map((s,i) => ({
        name: s.name,
        price: s.minutes_used
    }))

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.header}>Detaljeret overblik over alt din data:</Text>
            <FlatList 
                data={data}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => <Text>{item.name}: {item.price}kr</Text>}
            />
            
        </View>
        </>
    )
}}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
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
    }

    }
)