import { Alert, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import cookie from '@react-native-async-storage/async-storage'
import { useRouter, router, useFocusEffect } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"
import * as Linking from 'expo-linking'
import { useHealthkitAuthorization, useMostRecentQuantitySample } from '@kingstinct/react-native-healthkit';
import { useCallback, useEffect, useState } from "react"
import { User } from "@/class/user.class"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import dayjs from "dayjs"



const Setting = () => {

    let navigate = useRouter()
    let { setCurrent } = useMeasureStore()

    const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization({
        toRead: ['HKQuantityTypeIdentifierBloodGlucose', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierStepCount'],
    })

    let [user, setUser] = useState<any>(null)
    const [bmr, setBmr] = useState(0);


    useFocusEffect(useCallback(() => {
        (async () => {
            let u = new User()


            let res = await u.getUserData()


            console.log(res)
            setUser(res)

            let current_age = dayjs().diff(res?.dob, 'year')

            const genderConstant = res.sex === 'male' ? 5 : -161;
            setBmr((10 * res.weight) + (6.25 * res.height) - (5 * current_age) + genderConstant);
        })()
    }, []))

    return (
        <SafeAreaView>
            <View className="p-5 gap-5 items-center">

                {/* <Text>{sample?.value} {sample?.unit}</Text> */}

                {user && user.image ? <Image source={{ uri: user.image }} style={{ width: 100, height: 100, borderRadius: 100 }} /> : <View className="w-[100px] h-[100px] bg-gray-200 rounded-full"></View>}

                {user && user.name ? <Text className="font-[ebold] text-2xl text-gray-600">{user?.name}</Text> : <Text className="font-[ebold] text-2xl text-gray-600">Apple Signin</Text>}

                <TouchableOpacity onPress={async () => {
                    requestAuthorization()
                }} className="w-full h-[60px] bg-white rounded-2xl px-6 items-center justify-start gap-5 flex flex-row">
                    <Image source={require("../../../assets/images/health.png")} style={{ width: 40, height: 40, borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 5 }} />

                    <View>
                        <Text className="font-[ebold]">Apple Health Connect</Text>
                        <Text className="font-[emedium] text-sm text-gray-400">Tracks your steps and calories burned</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={async () => {
                    router.push("/editProfile")
                }} className="w-full py-5 bg-white rounded-2xl px-6 items-start gap-1 justify-center flex">
                    <Text className="font-[ebold] mb-2 text-xl text-gray-700">Basic Details</Text>
                    <Text className="font-[ebold] text-gray-600">- Age : {dayjs().diff(user?.dob, 'year')}</Text>
                    <Text className="font-[ebold] text-gray-600">- Weight : {user?.weight}</Text>
                    <Text className="font-[ebold] text-gray-600">- Height : {user?.height}</Text>
                    <Text className="font-[ebold] text-gray-600">- Sex : {user?.sex}</Text>
                    <Text className="font-[ebold] mb-1 mt-2 text-xl text-gray-700">Fomular Detail</Text>
                    <Text className="font-[ebold] text-gray-600">- BMR : {bmr.toFixed(0)}</Text>
                    <Text className="font-[ebold] text-gray-600">- TDEE Default x [1.2] : {Math.round(bmr * 1.2)}</Text>
                    <Text className="font-[ebold] text-gray-600">- Cal Deficit : {user?.fast}</Text>
                    <Text className="font-[ebold] text-gray-600">- Result of cutting : {Math.round(bmr * 1.2) - user?.fast}</Text>
                    <View className="border-t-1 w-full border-gray-300 mt-2">
                        <Text className="text-[18px] font-[medium] text-gray-500 mt-2">- {
                            user?.fast >= 500 ? '0.45' :
                                user?.fast >= 400 ? '0.36' :
                                    user?.fast >= 300 ? '0.27' :
                                        user?.fast >= 200 ? '0.18' :
                                            user?.fast >= 100 ? '0.09' :
                                                '0'
                        } kg / per week</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    await cookie.removeItem("token")

                    // Debug - check token is actually removed
                    const check = await cookie.getItem("token")
                    setCurrent(0)

                    router.replace("/")

                }} className="w-full h-[60px] flex-row bg-white rounded-2xl px-6 items-center gap-2 justify-start flex">
                    <Ionicons name="log-out-outline" size={24} color="#4b5563" />
                    <Text className="font-[ebold]">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Setting