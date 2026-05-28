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

    const translateY = useSharedValue(0)
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
        translateY.value = withTiming(-220, { duration: 700 })
        opacity1.value = withTiming(1, { duration: 700 })
        opacity2.value = withDelay(600, withTiming(1, { duration: 700 }))
    }, [])

    return (
        <View className="flex-1 justify-center items-center bg-white">

            {/* <Text className="font-[medium] text-2xl text-gray-500">วันเกิดของคุณ</Text> */}

            <Animated.View className={'absolute flex justify-center items-center '} style={anihead}>
                <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/rabbit.png')} />

                <Animated.Text className={'font-[mbold] text-4xl text-gray-600 mb-[-5px]'}>PLAY<Text className="text-amber-400">K</Text><Text className="text-red-500">C</Text><Text className="text-emerald-600">A</Text><Text className="text-blue-400">L</Text></Animated.Text>
                <Animated.Text className={'text-md text-gray-400 font-[esemibold]'}>Track your calories</Animated.Text>
            </Animated.View>

            <Animated.View style={anitimer}>
                <DatePicker display="spinner" mode="date" value={new Date(dob)} onChange={(e, selectedDate: any) => {
                    // console.log("Date changed : ", text.nativeEvent.timestamp)
                    setDob(selectedDate.toISOString())
                }}></DatePicker>
            </Animated.View>

            <Animated.View className={'absolute bottom-60'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className=" bg-black rounded-2xl">
                    <Text className="font-[ebold] text-white text-2xl px-4 py-2">Get Started</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View className={'absolute top-15 right-8'}>
                <TouchableOpacity onPress={() => {
                    nextPage(5)
                }} activeOpacity={0.7} className=" border-gray-300 rounded-md">
                    <Text className="font-[ebold] text-gray-500 text-md px-3 rounded-2xl py-2 bg-black text-white">Login</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Dob