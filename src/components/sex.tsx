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
        <View className="flex-1 justify-center items-center bg-white px-6">

            {/* ปุ่ม Back ทำเป็นปุ่มวงกลมสวยๆ */}
            <TouchableOpacity
                className="absolute top-16 left-6 w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex justify-center items-center z-10"
                onPress={() => setCurrent(current - 1)}
            >
                <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>

            {/* Header Section */}
            <View className="items-center mb-12 mt-[-40px]">
                <Text className="font-[ebold] text-3xl text-gray-800 mb-3 text-center">
                    What's your gender?
                </Text>
                <Text className="font-[emedium] text-base text-gray-500 text-center px-4">
                    This helps us calculate your daily calorie needs accurately.
                </Text>
            </View>

            {/* Gender Selection Cards */}
            <View className="w-full gap-5 flex-row">

                {/* Male Card */}
                <Animated.View className="flex-1">
                    <TouchableOpacity
                        onPress={() => {
                            setSex("male")
                            nextPage()
                        }}
                        activeOpacity={0.85}
                        className="rounded-[32px] bg-blue-50 border-2 border-blue-200 aspect-square flex justify-center items-center shadow-sm shadow-blue-200"
                    >
                        {/* วงกลมรองหลังไอคอน */}
                        <View className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center mb-4">
                            <Ionicons name="male" size={32} color="#3B82F6" />
                        </View>
                        <Text className="font-[ebold] text-blue-600 text-xl tracking-wide">Male</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Female Card */}
                <Animated.View className="flex-1">
                    <TouchableOpacity
                        onPress={() => {
                            setSex("female")
                            nextPage()
                        }}
                        activeOpacity={0.85}
                        className="rounded-[32px] bg-pink-50 border-2 border-pink-200 aspect-square flex justify-center items-center shadow-sm shadow-pink-200"
                    >
                        {/* วงกลมรองหลังไอคอน */}
                        <View className="w-16 h-16 bg-pink-100 rounded-full flex justify-center items-center mb-4">
                            <Ionicons name="female" size={32} color="#EC4899" />
                        </View>
                        <Text className="font-[ebold] text-pink-500 text-xl tracking-wide">Female</Text>
                    </TouchableOpacity>
                </Animated.View>

            </View>

        </View>
    )
}

export default Sex