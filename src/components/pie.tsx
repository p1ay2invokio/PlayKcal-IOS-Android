import { PieChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";

const Pie = () => {
    const protein = 120  // กรัม
    const carbs = 250    // กรัม
    const fat = 80       // กรัม
    const total = protein + carbs + fat

    const pieData = [
        {
            value: protein,
            color: '#f87171',
            text: `${Math.round((protein / total) * 100)}%`,
            label: 'Protein',
        },
        {
            value: carbs,
            color: '#4ade80',
            text: `${Math.round((carbs / total) * 100)}%`,
            label: 'Carbs',
        },
        {
            value: fat,
            color: '#60a5fa',
            text: `${Math.round((fat / total) * 100)}%`,
            label: 'Fat',
        },
    ] 

    return (
        <View className="flex-1 gap-5 items-center border border-gray-200 p-3 rounded-2xl
        ">
            <PieChart
                textColor="white"
                radius={70}
                data={pieData}
                donut
                innerRadius={50}
            />

            {/* Legend */}
            <View style={{ flexDirection: 'column', gap: 2 }}>
                {pieData.map((item) => (
                    <View key={item.label} style={{ gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                            <Text style={{ fontSize: 12, color: '#888' }}>{item.label}</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '500' }}>{item.value}g</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}


export default Pie