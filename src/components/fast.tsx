import { Text, TouchableOpacity, View } from "react-native"
import Slider from '@react-native-community/slider'
import Animated from "react-native-reanimated"
import { useMeasureStore } from "@/stores/measure.store"

const Fast = () => {

    let { nextPage, fast, setFast } = useMeasureStore()

    return (
        <View className="flex-1 justify-center items-center bg-white p-5">
            <Text className="font-[bold] text-3xl text-gray-600">How fast do you want to ....</Text>
            <Slider
                style={{ width: '80%', height: 40 }}
                minimumValue={0.3}
                maximumValue={1.5}
                step={0.1}
                value={fast ?? 1}
                onValueChange={(value: any) => setFast(value.toFixed(2))}
            />
            <Text className="font-[semibold] text-3xl">{fast} <Text className="text-[18px] font-[medium] text-gray-500">kg / per week</Text></Text>
            <Text className="font-[regular] text-xl">{Number(fast) >= 0.3 && Number(fast) <= 0.8 ? "Slow stable" : Number(fast) >= 0.9 ? "Fast You may feel tried" : ''}</Text>


            <Animated.View className={'absolute bottom-40'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md">
                    <Text className="font-[ebold] text-gray-500 text-2xl px-4 py-2">Get Started</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Fast