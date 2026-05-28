import { Text, TouchableOpacity, View } from "react-native"
import Slider from '@react-native-community/slider'
import Animated from "react-native-reanimated"
import { useMeasureStore } from "@/stores/measure.store"
import Ionicons from '@expo/vector-icons/Ionicons';

const Fast = () => {

    let { nextPage, fast, setFast, setCurrent, current } = useMeasureStore()

    return (
        <View className="flex-1 justify-center items-center bg-white p-5">

            <TouchableOpacity className="absolute top-15 left-5 p-2" onPress={() => setCurrent(current - 1)}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text className="font-[bold] text-3xl text-gray-600">How much calories deficit ?</Text>
            <Text className="font-[regular] text-md text-gray-600 mb-5">high deficit not sustainable</Text>
            <Slider
                style={{ width: '80%', height: 40 }}
                minimumValue={100}
                maximumValue={500}
                step={100}
                value={fast}
                onValueChange={(value: any) => setFast(Number(value))}
            />
            <Text className="font-[semibold] text-3xl">{fast} <Text className="text-[18px] font-[medium] text-gray-500">{
                fast >= 500 ? '0.45' :
                    fast >= 400 ? '0.36' :
                        fast >= 300 ? '0.27' :
                            fast >= 200 ? '0.18' :
                                fast >= 100 ? '0.09' :
                                    '0'
            } kg / per week</Text></Text>


            <Animated.View className={'absolute bottom-40'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className=" rounded-2xl bg-black py-1">
                    <Text className="font-[ebold] text-white text-2xl px-4 py-2">Start the journey</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Fast