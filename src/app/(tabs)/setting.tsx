import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import cookie from '@react-native-async-storage/async-storage'
import { useRouter, router, useFocusEffect, Link } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"
import * as Linking from 'expo-linking'
import { useHealthkitAuthorization, useMostRecentQuantitySample } from '@kingstinct/react-native-healthkit';
import { useCallback, useEffect, useState } from "react"
import { User } from "@/class/user.class"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import dayjs from "dayjs"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"



const Setting = () => {

    let navigate = useRouter()
    let { setCurrent, reset } = useMeasureStore()

    const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization({
        toRead: ['HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierStepCount'],
    })

    let [user, setUser] = useState<any>(null)
    const [bmr, setBmr] = useState(0);

    const [modal, setModal] = useState<"bmr" | "tdee" | "kgweek" | null>(null)

    let opa = useSharedValue(0)


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
        <View className="flex-1">

            {modal ? <View className="w-full h-full bg-gray-500/20 absolute top-0 left-0 z-10 justify-center items-center">
                {modal === "bmr" ? <View className="w-[80%] bg-white rounded-2xl p-5">
                    <View className="gap-3">

                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2 z-1">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[ebold] text-lg">BMR Calculation Method</Text>


                        {/* Male */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">Male</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">BMR = 10W + 6.25H − 5A + 5</Text>
                            </View>
                        </View>

                        {/* Female */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">Female</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">BMR = 10W + 6.25H − 5A − 161</Text>
                            </View>
                        </View>

                        {/* Variables */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">Variables</Text>
                            <Text className="font-[emedium] text-gray-600">W = Weight (kg)</Text>
                            <Text className="font-[emedium] text-gray-600">H = Height (cm)</Text>
                            <Text className="font-[emedium] text-gray-600">A = Age (years)</Text>
                        </View>

                        {/* Reference */}
                        <View className="border-t border-gray-200 pt-3 gap-1">
                            <Text className="font-[ebold] text-sm text-gray-500">Reference</Text>
                            <Text className="font-[emedium] text-xs text-gray-400">
                                Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals.
                                Am J Clin Nutr. 1990;51(2):241–247.
                            </Text>
                            <Link href="https://pubmed.ncbi.nlm.nih.gov/2305711/">
                                <Text className="font-[emedium] text-xs text-blue-400">https://pubmed.ncbi.nlm.nih.gov/2305711/</Text>
                            </Link>
                        </View>
                    </View>
                </View> : modal === "tdee" ? <View className="w-[80%] bg-white rounded-2xl p-5">
                    <View className="gap-3 ">
                        <Text className="font-[ebold] text-lg">TDEE Calculation Method</Text>



                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[emedium] text-gray-600 text-sm">
                            TDEE (Total Daily Energy Expenditure) is estimated by multiplying BMR by an activity factor based on the user's activity level.
                        </Text>

                        {/* Formula */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">Formula</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">TDEE = BMR × Activity Factor</Text>
                            </View>
                        </View>

                        {/* Activity Factors */}
                        <View className="gap-2">
                            <Text className="font-[ebold] text-base">Activity Factors</Text>
                            {[
                                { label: "Sedentary", desc: "little or no exercise", value: "1.2" },
                            ].map((item) => (
                                <View key={item.label} className="flex-row justify-between items-center bg-gray-50 rounded-xl p-3">
                                    <View className="flex-1">
                                        <Text className="font-[ebold] text-sm">{item.label}</Text>
                                        <Text className="font-[emedium] text-xs text-gray-400">{item.desc}</Text>
                                    </View>
                                    <Text className="font-[ebold] text-sm text-green-500">{item.value}</Text>
                                </View>
                            ))}
                        </View>

                        {/* References */}
                        <View className="border-t border-gray-200 pt-3 gap-2">
                            <Text className="font-[ebold] text-sm text-gray-500">References</Text>
                            <Text className="font-[emedium] text-xs text-gray-400">
                                Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247.
                            </Text>
                            <Link href="https://pubmed.ncbi.nlm.nih.gov/2305711/" asChild>
                                <Text className="font-[emedium] text-xs text-blue-400 underline">https://pubmed.ncbi.nlm.nih.gov/2305711/</Text>
                            </Link>
                            <Text className="font-[emedium] text-xs text-gray-400">National Academy of Sports Medicine (NASM)</Text>
                            <Link href="https://www.nasm.org" asChild>
                                <Text className="font-[emedium] text-xs text-blue-400 underline">https://www.nasm.org</Text>
                            </Link>
                            <Text className="font-[emedium] text-xs text-gray-400">American Council on Exercise (ACE)</Text>
                            <Link href="https://www.acefitness.org" asChild>
                                <Text className="font-[emedium] text-xs text-blue-400 underline">https://www.acefitness.org</Text>
                            </Link>
                        </View>

                        {/* Disclaimer */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <Text className="font-[ebold] text-sm text-yellow-700 mb-1">Disclaimer</Text>
                            <Text className="font-[emedium] text-xs text-yellow-600">
                                The calculations provided by PlayKcal are estimates for informational and educational purposes only and should not be considered medical advice.
                            </Text>
                        </View>
                    </View>
                </View> : modal === "kgweek" ? <View className="w-[80%] bg-white rounded-2xl p-5">
                    <View className="gap-3">


                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2 z-1">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[ebold] text-lg">Estimated Weight Change</Text>

                        <Text className="font-[emedium] text-gray-600 text-sm">
                            Weight change estimates are based on the principle that a calorie deficit may contribute to gradual weight loss over time.
                        </Text>

                        {/* Key Fact */}
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 gap-1">
                            <Text className="font-[ebold] text-sm text-blue-700">Key Estimate</Text>
                            <Text className="font-[emedium] text-xs text-blue-600">
                                A daily calorie deficit of approximately 500 kcal may result in a weight loss of about 0.45 kg (1 lb) per week.
                            </Text>
                        </View>

                        {/* References */}
                        <View className="border-t border-gray-200 pt-3 gap-3">
                            <Text className="font-[ebold] text-sm text-gray-500">References</Text>

                            <View className="gap-1">
                                <Text className="font-[ebold] text-xs text-gray-600">Centers for Disease Control and Prevention (CDC)</Text>
                                <Text className="font-[emedium] text-xs text-gray-400">
                                    Healthy weight loss is generally considered to be about 1–2 pounds (0.45–0.9 kg) per week.
                                </Text>
                                <Link href="https://www.cdc.gov/healthy-weight-growth/losing-weight/" asChild>
                                    <Text className="font-[emedium] text-xs text-blue-400 underline">
                                        https://www.cdc.gov/healthy-weight-growth/losing-weight/
                                    </Text>
                                </Link>
                            </View>

                            <View className="gap-1">
                                <Text className="font-[ebold] text-xs text-gray-600">NHS (National Health Service)</Text>
                                <Text className="font-[emedium] text-xs text-gray-400">
                                    A safe and sustainable rate of weight loss is about 0.5–1 kg per week.
                                </Text>
                                <Link href="https://www.nhsinform.scot/healthy-living/weight-loss/tips-for-losing-weight-safely/" asChild>
                                    <Text className="font-[emedium] text-xs text-blue-400 underline">
                                        https://www.nhsinform.scot/healthy-living/weight-loss/tips-for-losing-weight-safely/
                                    </Text>
                                </Link>
                            </View>
                        </View>

                        {/* Disclaimer */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <Text className="font-[ebold] text-sm text-yellow-700 mb-1">Disclaimer</Text>
                            <Text className="font-[emedium] text-xs text-yellow-600">
                                Weight change calculations are estimates only and may vary based on metabolism, body composition, activity level, hydration, and other individual factors. This information is provided for educational purposes and should not be considered medical advice.
                            </Text>
                        </View>
                    </View>
                </View> : null}
            </View> : null}

            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

                <View className="p-5 gap-5 items-center flex-1 bg-white pt-">

                    {/* <Text>{sample?.value} {sample?.unit}</Text> */}

                    <TouchableOpacity onPress={() => {
                        opa.value = withTiming(opa.value === 0 ? 1 : 0, { duration: 200 })
                    }} className="absolute right-10 top-5">
                        <Ionicons name="ellipsis-horizontal-outline" size={24} color="gray" />
                    </TouchableOpacity>

                    <Animated.View style={useAnimatedStyle(() => ({ opacity: opa.value }))} className="w-[150px] bg-white border border-gray-300 rounded-2xl absolute right-10 top-12 z-[1] shadow">
                        <TouchableOpacity onPress={() => {

                            opa.value = withTiming(0, { duration: 200 })

                            Alert.alert(
                                "Delete Account !",
                                "your data will be lost and cannot be recovered",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Delete",
                                        style: "destructive",
                                        onPress: async () => {
                                            let u = new User()

                                            let res = await u.deleteAccount()

                                            if (res === 'deleted') {

                                                Alert.alert("Deleting Account...")

                                                setTimeout(async () => {
                                                    await cookie.removeItem("token")
                                                    reset()

                                                    router.replace('/register')
                                                }, 1000)
                                            }


                                        }
                                    }
                                ]
                            )
                        }} className="px-2 flex justify-center items-center py-2 border-gray-300">
                            <Text className="font-[ebold] text-red-400">Delete Account</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {user && user.image ? <Image source={{ uri: user.image }} style={{ width: 100, height: 100, borderRadius: 100 }} /> : <View className="w-[100px] h-[100px] bg-gray-200 rounded-full"></View>}

                    {user && user.name ? <Text className="font-[ebold] text-2xl text-gray-600">{user?.name}</Text> : <Text className="font-[ebold] text-2xl text-gray-600">Apple Signin</Text>}

                    <TouchableOpacity onPress={async () => {
                        requestAuthorization()
                    }} disabled={authorizationStatus === 2 ? true : false} className={`w-full h-[60px] ${authorizationStatus === 2 ? 'bg-green-50 border border-green-300' : 'bg-white border border-gray-200'} rounded-2xl px-6 items-center justify-start gap-5 flex flex-row`}>
                        <Image source={require("../../../assets/images/health.png")} style={{ width: 40, height: 40, borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 5 }} />

                        <View>
                            <View className="flex flex-row gap-2 items-center">
                                <Text className={`font-[ebold] ${authorizationStatus === 2 ? 'text-green-700' : 'text-gray-600'}`}>Apple Health Connect</Text>
                                <Image source={require("../../../assets/images/check.png")} style={{ width: 15, height: 15 }} />
                            </View>
                            <Text className={`font-[emedium] text-sm ${authorizationStatus === 2 ? 'text-green-700' : 'text-gray-600'}`}>Tracks your steps and calories burned</Text>
                        </View>
                    </TouchableOpacity>


                    <View className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm elevation-2 relative">

                        {/* ปุ่มแก้ไข */}
                        <TouchableOpacity
                            className="absolute right-5 top-5 z-1 w-8 h-8 bg-slate-50 rounded-full items-center justify-center"
                            onPress={() => navigate.push("/editProfile")}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="pencil" size={16} color="#64748b" />
                        </TouchableOpacity>

                        {/* --- ส่วนที่ 1: Basic Details --- */}
                        <View className="flex flex-row gap-2 items-center mb-4">
                            <View className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <Ionicons name="person" size={16} color="#3b82f6" />
                            </View>
                            <Text className="font-[ebold] text-lg text-slate-800">Basic Details</Text>
                        </View>

                        {/* Grid ข้อมูลส่วนตัว 2x2 */}
                        <View className="flex flex-row flex-wrap justify-between gap-y-3 w-full">
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">Age</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{dayjs().diff(user?.dob, 'year')} <Text className="font-[medium] text-xs">yrs</Text></Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">Gender</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.sex}</Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">Weight</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.weight} <Text className="font-[medium] text-xs">kg</Text></Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">Height</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.height} <Text className="font-[medium] text-xs">cm</Text></Text>
                            </View>
                        </View>

                        {/* เส้นคั่น */}
                        <View className="w-full h-[1px] bg-slate-100 my-5" />

                        {/* --- ส่วนที่ 2: Formula Details --- */}
                        <View className="flex flex-row gap-2 items-center mb-4">
                            <View className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Ionicons name="body" size={18} color="#10b981" />
                            </View>
                            <Text className="font-[ebold] text-lg text-slate-800">Formula Details</Text>
                        </View>

                        {/* List การเผาผลาญ */}
                        <View className="flex gap-y-3 w-full px-1">
                            <View className="flex flex-row items-center justify-between w-full">
                                <View className="flex flex-row items-center gap-2">
                                    <Text className="font-[esemibold] text-slate-500">BMR</Text>
                                    <TouchableOpacity onPress={() => setModal("bmr")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Ionicons name="information-circle" size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="font-[ebold] text-slate-700">{bmr.toFixed(0)} <Text className="font-[medium] text-xs text-slate-400">kcal</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <View className="flex flex-row items-center gap-2">
                                    <Text className="font-[esemibold] text-slate-500">TDEE (x1.2)</Text>
                                    <TouchableOpacity onPress={() => setModal("tdee")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Ionicons name="information-circle" size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="font-[ebold] text-slate-700">{Math.round(bmr * 1.2)} <Text className="font-[medium] text-xs text-slate-400">kcal</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <Text className="font-[esemibold] text-slate-500">Calorie Deficit</Text>
                                <Text className="font-[ebold] text-orange-500">-{user?.fast} <Text className="font-[medium] text-xs text-orange-400">kcal</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <Text className="font-[esemibold] text-slate-500">Target Intake</Text>
                                <Text className="font-[ebold] text-emerald-500">{Math.round(bmr * 1.2) - user?.fast} <Text className="font-[medium] text-xs text-emerald-400">kcal/day</Text></Text>
                            </View>
                        </View>

                        {/* --- ส่วนที่ 3: Result Banner --- */}
                        <View className="mt-5 w-full bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-row justify-between items-center">
                            <View>
                                <Text className="font-[medium] text-xs text-rose-400 mb-1">Expected Weight Loss</Text>
                                <Text className="text-xl font-[ebold] text-rose-600">
                                    -{user?.fast >= 500 ? '0.45' :
                                        user?.fast >= 400 ? '0.36' :
                                            user?.fast >= 300 ? '0.27' :
                                                user?.fast >= 200 ? '0.18' :
                                                    user?.fast >= 100 ? '0.09' : '0'} <Text className="text-sm font-[esemibold]">kg / week</Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModal("kgweek")}
                                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                            >
                                <Ionicons name="help" size={20} color="#f43f5e" />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity onPress={async () => {
                        await cookie.removeItem("token")

                        // Debug - check token is actually removed
                        const check = await cookie.getItem("token")
                        reset()

                        router.replace("/")

                    }} className="w-full h-[60px] flex-row bg-white rounded-2xl border border-gray-200 px-6 items-center gap-2 justify-start flex">
                        <Ionicons name="log-out-outline" size={24} color="#4b5563" />
                        <Text className="font-[ebold]">Sign Out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={async () => {

                        const check = await cookie.getItem("token")

                        console.log("CHECK TOKEN : ", check)

                    }} className="w-full h-[60px] flex-row bg-white rounded-2xl border border-gray-200 px-6 items-center gap-2 justify-start flex">
                        <Ionicons name="log-out-outline" size={24} color="#4b5563" />
                        <Text className="font-[ebold]">Check Token</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    )
}

export default Setting