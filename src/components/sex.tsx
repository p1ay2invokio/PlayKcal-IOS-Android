import { useMeasureStore } from "@/stores/measure.store"
import { useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const Sex = () => {

    let { setSex, nextPage } = useMeasureStore()

    let navigate = useRouter()

    return (
        <View className="flex-1 justify-start items-center bg-white pt-20 p-5">

            <Text className="font-[ebold] text-[24px] text-gray-500 mb-10">Choose your gender</Text>

            <View className="w-full gap-4">
                <Animated.View className={'w-full'}>
                    <TouchableOpacity onPress={() => {
                        setSex("male")
                        nextPage()
                    }} activeOpacity={0.7} className="border border-gray-300 rounded-md">
                        <Text className="font-[emedium] text-gray-500 text-2xl w-[100%] text-center py-2">Male</Text>
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View className={'w-full'}>
                    <TouchableOpacity onPress={() => {
                        setSex("female")
                        nextPage()
                    }} activeOpacity={0.7} className="border border-gray-300 rounded-md">
                        <Text className="font-[emedium] text-gray-500 text-2xl w-[100%] text-center py-2">Female</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

        </View>
    )
}

export default Sex