import { useMeasureStore } from "@/stores/measure.store"
import { useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from '@expo/vector-icons/Ionicons';


const Sex = () => {

    let { setSex, nextPage, current, setCurrent } = useMeasureStore()

    let navigate = useRouter()

    return (
        <View className="flex-1 justify-center items-center bg-white p-5">

            <TouchableOpacity className="absolute top-15 left-5 p-2" onPress={() => setCurrent(current - 1)}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text className="font-[ebold] text-[24px] text-gray-600 mb-10">What's your gender ?</Text>

            <View className="w-full gap-4 flex-row">
                <Animated.View className={'flex-1'}>
                    <TouchableOpacity onPress={() => {
                        setSex("male")
                        nextPage()
                    }} activeOpacity={0.7} className=" rounded-2xl py-1 bg-blue-600/10 border border-blue-300">
                        <Text className="font-[esemibold] text-blue-500 text-2xl w-[100%] text-center py-2">Male</Text>
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View className={'flex-1'}>
                    <TouchableOpacity onPress={() => {
                        setSex("female")
                        nextPage()
                    }} activeOpacity={0.7} className=" rounded-2xl py-1 bg-pink-500/10 border border-pink-300">
                        <Text className="font-[esemibold] text-pink-400 text-2xl w-[100%] text-center py-2">Female</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

        </View>
    )
}

export default Sex