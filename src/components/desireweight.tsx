import { Text, TouchableOpacity, View } from "react-native"
import { Picker } from '@react-native-picker/picker'
import Animated from "react-native-reanimated"
import { useMeasureStore } from "@/stores/measure.store"

const Desire = () => {



    let { nextPage, weight, setTargetWeight, targetWeight, goal } = useMeasureStore()

    const start = goal === 'lose_weight' ? weight - 20
        : goal === 'gain_weight' ? weight + 1
            : weight; // maintain_weight fallback

    const end = goal === 'lose_weight' ? weight - 1
        : goal === 'gain_weight' ? weight + 20
            : weight; // maintain_weight fallback

    let arr = start !== null && end !== null
        ? Array.from({ length: end - start + 1 }, (_, i) => i + start)
        : [];

    if (!arr) {
        return null
    }

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="font-[ebold] text-3xl text-gray-500 absolute top-20">Desired Weight</Text>
            <Picker
                selectedValue={targetWeight}
                onValueChange={(itemValue: any) => setTargetWeight(itemValue)}
                style={{
                    width: 200,
                    height: 200,
                }}
            >
                {arr.map((item: any) => {
                    return <Picker.Item key={item} label={item.toString()} value={item} />
                })}
            </Picker>


            <Animated.View className={'absolute bottom-40'}>
                <TouchableOpacity onPress={() => {
                    if(goal == 'maintain'){
                        nextPage(2)
                    }else{
                        nextPage()
                    }
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md px-10 py-1">
                    <Text className="font-[ebold] text-gray-500 text-2xl px-4 py-2">Next</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Desire