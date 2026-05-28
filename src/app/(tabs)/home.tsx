import { Alert, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import GaugeCircle from "../../components/gaugecircle"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"
import cookie from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from "react"
import { router, useFocusEffect, useRouter } from "expo-router"
import dayjs from 'dayjs'
import { useMostRecentQuantitySample } from "@kingstinct/react-native-healthkit"
import DatePicker from '@react-native-community/datetimepicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { User } from "@/class/user.class"
import { FlashList } from "@shopify/flash-list";
import { jwtDecode } from 'jwt-decode'
import { public_url } from "../../../config"
import * as Haptic from 'expo-haptics'
import { useCurrentPickDate } from "@/stores/date.store"

const Dashboard = () => {

    let navigate = useRouter()

    let [calendarModal, setCalendarModal] = useState(false)


    const kcal = useMostRecentQuantitySample('HKQuantityTypeIdentifierActiveEnergyBurned')
    const step = useMostRecentQuantitySample('HKQuantityTypeIdentifierStepCount')

    let opacity = useSharedValue(0)

    let [dailyDetail, setDetail] = useState<any>([])


    let [user, setUser] = useState<any>(null)
    let [selectDay, setSelectDay] = useState<any>(new Date())
    let { currentDate, setCurrentDate } = useCurrentPickDate()


    useFocusEffect(useCallback(() => {
        (async () => {
            let usr = new User()
            let token = await cookie.getItem("token")

            let decoded = await jwtDecode(token as string)

            setUser(decoded)

            let convertDay = dayjs(currentDate).format("DD-MM-YYYY")

            let res = await usr.getDaily(convertDay)

            console.log("ED : ", res)

            if (res.daily.dailyCalories == 0 || res.daily.dailyCalories == null) {
                Alert.alert("You have to set your perosnal first", '', [
                    {
                        text: "Setting",
                        onPress() {
                            navigate.push("/editProfile")
                        }
                    },
                ])
            } else {

                console.log(res.daily)

                setDetail(res.daily)
            }
        })()
    }, [currentDate]))

    const raw = ((dailyDetail.dailyCalories - dailyDetail.totalCalories + dailyDetail.totalBurned) / dailyDetail.dailyCalories) * 100;
    const remain = Math.min(100, Math.max(0, raw));

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
            <ScrollView style={{ flex: 1 }}>
                <View className="w-full h-[70px] justify-between flex-row px-5">

                    <View className="flex-row items-center gap-2">

                        <Image style={{ width: 60, height: 60 }} source={require("../../../assets/images/rabbit.png")} className="w-full h-full object-cover" />
                        <View>
                            <Text className="font-[mbold] text-2xl text-gray-600">PLAY<Text className="text-amber-500">K</Text><Text className="text-red-500">C</Text><Text className="text-emerald-600">A</Text><Text className="text-blue-400">L</Text></Text>
                            <Text className="font-[mbold] text-md text-gray-600">calories deficiet</Text>
                        </View>

                    </View>


                    <View className="flex flex-row items-center gap-2">
                        <TouchableOpacity className="p-4 bg-slate-100 rounded-full" activeOpacity={0.7} onPress={() => {
                            opacity.value = withTiming(calendarModal ? 0 : 1, { duration: 200 })
                            setCalendarModal(!calendarModal)
                        }}>
                            <Ionicons name="calendar" size={32} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            navigate.push("/(tabs)/setting")
                        }} className="bg-gray-600 rounded-full w-[50px] h-[50px]">
                            <Image style={{ width: 50, height: 50, borderRadius: 999 }} source={user?.img ? { uri: user.img } : ''} className="w-full h-full object-cover rounded-full" />
                        </TouchableOpacity>
                    </View>

                </View>

                <Animated.View style={[useAnimatedStyle(() => ({ opacity: opacity.value }))]} className="absolute top-16 left-[30px] border border-gray-200 shadow bg-white z-[1] rounded-xl">
                    <DatePicker style={{ backgroundColor: 'white', borderRadius: 12 }} display="inline" value={selectDay} onChange={(e, d) => {
                        setCurrentDate(d)
                        opacity.value = withTiming(0, { duration: 200 })
                    }} />
                </Animated.View>

                <View className=" p-3 justify-center items-center flex flex-row gap-10">
                    <View className="flex justify-center items-center w-[80px]">
                        <Text className="font-[esemibold]">Consumed</Text>
                        <Text className="font-[esemibold]">{dailyDetail.totalCalories}</Text>
                    </View>

                    <View>
                        <GaugeCircle size={90} value={remain} startAngle={-210} sweepAngle={240} strokeWidth={10} label={`${(dailyDetail.dailyCalories - dailyDetail.totalCalories) + dailyDetail.totalBurned}`} color="#10b981"></GaugeCircle>
                        <Text className="font-[emedium] text-gray-500 mt-[-10] text-[12px]">Remaining Kcal</Text>
                    </View>


                    <View className="flex justify-center items-center w-[80px]">
                        <Text className="font-[esemibold]">Burned</Text>
                        <Text className="font-[esemibold]">{dailyDetail.totalBurned}</Text>
                    </View>
                </View>


                <View className="flex-row gap-5 mt-0 border-gray-100 p-3 rounded-[18px] justify-center items-center">
                    <View className="flex justify-center items-center gap-3">
                        <GaugeCircle size={90} value={(((dailyDetail.dailyProtein - dailyDetail.totalProtein) / dailyDetail.dailyProtein) * 100) < 0 ? 0 : (((dailyDetail.dailyProtein - dailyDetail.totalProtein) / dailyDetail.dailyProtein) * 100)} strokeWidth={10} label={`${dailyDetail.dailyProtein - dailyDetail.totalProtein}`} color="#dc2626" sublabel="g"></GaugeCircle>
                        <View className="flex justify-center items-center">
                            <View className="flex flex-row items-center mb-[-10px] items-center">
                                <Image style={{ width: 40, height: 40 }} source={require("../../../assets/images/protein.png")} className="w-full h-full object-cover" />
                                <Text className="font-[emedium]">Protien</Text>
                            </View>
                            <Text className="font-[emedium] text-gray-400 text-sm">({dailyDetail.totalProtein}/{dailyDetail.dailyProtein})</Text>
                        </View>
                    </View>
                    <View className="flex justify-center items-center gap-3">
                        <GaugeCircle size={90} value={(((dailyDetail.dailyCarbs - dailyDetail.totalCarbs) / dailyDetail.dailyCarbs) * 100) < 0 ? 0 : (((dailyDetail.dailyCarbs - dailyDetail.totalCarbs) / dailyDetail.dailyCarbs) * 100)} strokeWidth={10} label={`${dailyDetail.dailyCarbs - dailyDetail.totalCarbs}`} color="#0ea5e9"></GaugeCircle>
                        <View className="flex justify-center items-center">
                            <View className="flex flex-row items-center mb-[0px] gap-0">
                                <Image style={{ width: 40, height: 30 }} source={require("../../../assets/images/rices.png")} className="w-full h-full object-cover" />
                                <Text className="font-[emedium]">Carbs</Text>
                            </View>
                            <Text className="font-[emedium] text-gray-400 text-sm">({dailyDetail.totalCarbs}/{dailyDetail.dailyCarbs})</Text>
                        </View>
                    </View>
                    <View className="flex justify-center items-center gap-3">
                        <GaugeCircle size={90} value={(((dailyDetail.dailyFat - dailyDetail.totalFat) / dailyDetail.dailyFat) * 100) < 0 ? 0 : (((dailyDetail.dailyFat - dailyDetail.totalFat) / dailyDetail.dailyFat) * 100)} strokeWidth={10} label={`${dailyDetail.dailyFat - dailyDetail.totalFat}`} color="#facc15"></GaugeCircle>
                        <View className="flex justify-center items-center">
                            <View className="flex flex-row items-center mb-[-5px] gap-1">
                                <Image style={{ width: 40, height: 30 }} source={require("../../../assets/images/cheese.png")} className="w-full h-full object-cover" />
                                <Text className="font-[emedium]">Fat</Text>
                            </View>
                            <Text className="font-[emedium] text-gray-400 text-sm">({dailyDetail.totalFat}/{dailyDetail.dailyFat})</Text>
                        </View>
                    </View>
                </View>

                <View className="mt-5 flex flex-row gap-5 items-center w-full justify-center">
                    <View className="w-[80px] h-[1px] rounded-full bg-gray-200"></View>
                    <Text className="font-[esemibold] text-gray-800">Food and Activities</Text>
                    <View className="w-[80px] h-[1px] rounded-full bg-gray-200"></View>
                </View>

                <View className="w-full flex flex-row gap-2 items-center justify-center mt-5">
                    <Text className="font-[eregular] text-sm text-gray-400">Date {dayjs(currentDate).format("DD-MM-YYYY")}</Text>
                </View>


                <View className="w-full bg-white px-7 py-3 gap-5">

                    {/* {kcal && step ? <View className="w-full h-[110px] p-2 flex flex-row gap-5 bg-white border rounded-[12px] border-gray-200 shadow-sm">
                        <View className="w-[30%] h-full rounded-xl bg-transparent">
                            <Image style={{ width: "100%", height: "100%", borderWidth: 1, borderColor: "#eee", borderRadius: 16 }} source={require("../../../assets/images/health.png")} className="w-full h-full object-cover" />
                        </View>
                        <View className="w-[calc(100%-40%)]">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="text-xl font-[ebold] text-gray-800">Apple Health</Text>
                                <Text className="font-[ebold] text-gray-400">{dayjs().format('HH:mm')}</Text>
                            </View>
                            <View className="flex flex-row gap-2 items-center">
                                <Text className="font-[esemibold] text-gray-600 text-xl">{step?.quantity} Steps</Text>
                            </View>
                            <View className="flex flex-row gap-2 items-center">
                                <Text className="font-[esemibold] text-gray-400 text-xl">{Number(kcal?.quantity).toFixed(0)} kcal</Text>
                            </View>
                        </View>
                    </View> : null} */}

                    <FlashList
                        data={dailyDetail.exerciseLogs}
                        renderItem={({ item }: any) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium)

                                    router.push(`/ex/${item.id}`)
                                }} activeOpacity={0.9} className="w-full h-[110px] p-2 flex flex-row gap-5 bg-white border rounded-[12px] border-gray-200 shadow">


                                    <View className="w-[30%] h-full rounded-xl bg-gray-100 flex justify-center items-center">

                                        {item.img ? <Image style={{ width: '100%', height: '100%', borderRadius: 12 }} source={{ uri: `${public_url}/foods/${item.img}` }}></Image> : <View className="flex justify-center items-center">
                                            <Ionicons name="code-working" size={40} color="#ccc" />
                                            <Text className="text-sm text-center text-gray-500 font-[ebold]">Image Not Available</Text>
                                        </View>
                                        }

                                    </View>
                                    <View className="w-[calc(100%-36%)]">
                                        <View className="flex flex-row items-center justify-between">
                                            <Text className="text-lg font-[medium] text-gray-700 line-clamp-1 w-[160px]">{item.name}</Text>
                                            <Text className="font-[ebold] text-sm text-gray-400">{dayjs(item.createdAt).format("HH:mm")}</Text>
                                        </View>
                                        <View className="flex flex-row gap-1 items-center">
                                            <Image style={{ width: 25, height: 25 }} source={require("../../../assets/images/fire.png")} className="w-full h-full object-cover" />
                                            <Text className={`font-[ebold] text-xl ${item.quantity <= 0 ? 'line-through text-gray-300' : 'text-orange-600'}`}>{item.caloriesBurned} Kcal</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}>

                    </FlashList>

                    <FlashList
                        data={dailyDetail.foodLogs}
                        renderItem={({ item }: any) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium)

                                    router.push(`/product/${item.id}`)
                                }} activeOpacity={0.9} className="w-full h-[110px] mb-5 p-2 flex flex-row gap-5 bg-white border rounded-[12px] border-gray-200 shadow">


                                    <View className="w-[30%] h-full rounded-xl bg-gray-100 flex justify-center items-center">

                                        {item.img ? <Image style={{ width: '100%', height: '100%', borderRadius: 12 }} source={{ uri: `${public_url}/foods/${item.img}` }}></Image> : <View className="flex justify-center items-center">
                                            <Ionicons name="restaurant-outline" size={40} color="#ccc" />
                                            <Text className="text-sm text-center text-gray-500 font-[ebold]">Image Not Available</Text>
                                        </View>
                                        }

                                    </View>
                                    <View className="w-[calc(100%-36%)]">
                                        <View className="flex flex-row items-center justify-between">
                                            <Text className="text-lg font-[medium] text-gray-700 line-clamp-1 w-[160px]">{item.name}</Text>
                                            <Text className="font-[ebold] text-sm text-gray-400">{dayjs(item.createdAt).format("HH:mm")}</Text>
                                        </View>
                                        <View className="flex flex-row gap-1 items-center">
                                            <Image style={{ width: 25, height: 25 }} source={require("../../../assets/images/fire.png")} className="w-full h-full object-cover" />
                                            <Text className={`font-[ebold] text-xl ${item.quantity <= 0 ? 'line-through text-gray-300' : 'text-orange-600'}`}>{item.calories} Kcal</Text>
                                        </View>
                                        <View className="flex flex-row gap-1">
                                            <View className="flex flex-row items-center">
                                                <Image style={{ width: 30, height: 30 }} source={require("../../../assets/images/protein.png")} className="w-full h-full object-cover" />
                                                <Text className="font-[esemibold] text-gray-500 text-sm">{item.protein}g</Text>
                                            </View>
                                            <View className="flex flex-row items-center">
                                                <Image style={{ width: 35, height: 35 }} source={require("../../../assets/images/rices.png")} className="w-full h-full object-cover" />
                                                <Text className="font-[esemibold] text-gray-500 text-sm">{item.carbs}g</Text>
                                            </View>
                                            <View className="flex flex-row items-center">
                                                <Image style={{ width: 30, height: 30 }} source={require("../../../assets/images/cheese.png")} className="w-full h-full object-cover" />
                                                <Text className="font-[esemibold] text-gray-500 text-sm">{item.fat}g</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}>

                    </FlashList>

                </View>
            </ScrollView>


            <TouchableOpacity onPress={() => {
                navigate.push({
                    pathname: "/addItem",
                    params: {
                        dailyLogId: dailyDetail.id
                    }
                })
            }} className="w-[60px] h-[60px] flex justify-center items-center absolute bottom-30 rounded-full right-10 bg-linear-to-r from-purple-200 via-violet-400 to-indigo-600 shadow" activeOpacity={0.7}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>




        </SafeAreaView>
    )
}

export default Dashboard