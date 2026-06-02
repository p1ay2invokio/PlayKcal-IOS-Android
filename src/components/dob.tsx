import { useEffect, useRef, useState } from "react"
import { Button, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated"
import DatePicker from '@react-native-community/datetimepicker'
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"

const Dob = () => {

    let navigate = useRouter()

    let { nextPage, previousPage, setDob, dob } = useMeasureStore()

    let [today, setToday] = useState(new Date())

    const translateY = useSharedValue(-400)
    const opacity1 = useSharedValue(0)
    const opacity2 = useSharedValue(0)

    const anihead = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity1.value
    }))

    const anitimer = useAnimatedStyle(() => ({
        opacity: opacity2.value
    }))

    useEffect(() => {
        translateY.value = withTiming(0, { duration: 700 })
        opacity1.value = withTiming(1, { duration: 700 })
        opacity2.value = withDelay(600, withTiming(1, { duration: 700 }))
    }, [])

    return (
        <View className="flex-1 bg-white px-6">

            {/* ปุ่ม Login มุมขวาบน (ปรับเป็นทรง Pill มินิมอล) */}
            <Animated.View className="absolute top-16 right-6 z-10">
                <TouchableOpacity
                    onPress={() => nextPage(5)}
                    activeOpacity={0.7}
                    className="bg-gray-50 border border-gray-200 px-5 py-2 rounded-full"
                >
                    <Text className="font-[ebold] text-gray-600 text-sm">Login</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* ส่วนโลโก้แอป (Header) */}
            <Animated.View style={anihead} className="items-center mt-32 mb-10">
                <Image style={{ width: 90, height: 90 }} source={require('../../assets/images/rabbit.png')} />

                <Text className="font-[mbold] text-4xl text-gray-800 mt-2 mb-[-5px]">
                    PLAY<Text className="text-amber-400">K</Text><Text className="text-red-500">C</Text><Text className="text-emerald-600">A</Text><Text className="text-blue-400">L</Text>
                </Text>
                <Text className="text-sm text-gray-400 font-[esemibold] mt-1 tracking-wide">
                    Track your calories
                </Text>
            </Animated.View>

            {/* ส่วนใส่ข้อมูลวันเกิด (Center Content) */}
            <View className="flex-1 justify-center items-center w-full mt-[-20px]">

                {/* ข้อความบอกให้ใส่วันเกิด */}
                <Text className="font-[ebold] text-2xl text-gray-800 mb-4 text-center">
                    When is your birthday?
                </Text>

                <Animated.View style={anitimer} className="bg-gray-50 py-6 px-4 rounded-[32px] w-full items-center border border-gray-100 shadow-sm shadow-gray-100">
                    <DatePicker
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
                        display="spinner"
                        mode="date"
                        value={new Date(dob)}
                        onChange={(e, selectedDate: any) => {
                            if (selectedDate) setDob(selectedDate.toISOString())
                        }}
                    />
                </Animated.View>
            </View>

            {/* ส่วนปุ่ม Get Started (ดันลงล่างสุดอัตโนมัติ) */}
            <Animated.View className="w-full mt-auto mb-12">
                <TouchableOpacity
                    onPress={() => nextPage()}
                    activeOpacity={0.85}
                    className="w-full rounded-[24px] bg-gray-900 py-4 items-center flex justify-center shadow-md shadow-gray-400/30"
                >
                    <Text className="font-[ebold] text-white text-xl tracking-wide">
                        Get Started
                    </Text>
                </TouchableOpacity>
            </Animated.View>

        </View>
    )
}

export default Dob