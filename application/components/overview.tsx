import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';


const subscription: {name: string, type: string, price: number, due_date: string } =  {
    name: "Netflix",
    type: "Streaming",
    price: 10,
    due_date: "06",
}

export default function Overview() {{
    return (
        <>
        <View style={styles.container}>
            <Text style={styles.header}>Detaljeret overblik over alt din data:</Text>
            <Text style={styles.baseText}>{subscription.name}: {subscription.price}kr</Text>
            <Text style={styles.baseText}>Samlet beløb: {subscription.price + subscription.price}kr</Text>
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