import { Alert, Linking, Pressable, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import GaugeCircle from "../../components/gaugecircle"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Image } from "expo-image"
import cookie from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { router, useFocusEffect, useRouter } from "expo-router"
import dayjs from 'dayjs'
import { useHealthkitAuthorization, useMostRecentQuantitySample, useStatisticsForQuantity } from "@kingstinct/react-native-healthkit"
import DatePicker from '@react-native-community/datetimepicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { User } from "@/class/user.class"
import { FlashList } from "@shopify/flash-list";
import { jwtDecode } from 'jwt-decode'
import { public_url } from "../../../config"
import * as Haptic from 'expo-haptics'
import { useCurrentPickDate } from "@/stores/date.store"
import { Excercise } from "@/class/excercise.class"
import { Stat } from "@/class/stat.class"
import { useLanguageStore } from "@/stores/language.store"

const Dashboard = () => {

    let navigate = useRouter()
    const { t, locale } = useLanguageStore()
    const insets = useSafeAreaInsets()

    let [calendarModal, setCalendarModal] = useState(false)


    const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization({
        toRead: ['HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierStepCount'],
    })


    const midnightToday = useRef((() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    })()).current;
    const now = useRef(new Date()).current;

    let kcal: any = useStatisticsForQuantity('HKQuantityTypeIdentifierActiveEnergyBurned', ['cumulativeSum'], midnightToday, now, 'Cal')
    let step: any = useStatisticsForQuantity('HKQuantityTypeIdentifierStepCount', ['cumulativeSum'], midnightToday, now, 'count')
    let kcal_value: any = Math.floor(kcal?.sumQuantity?.quantity)
    let step_value: any = step?.sumQuantity?.quantity

    console.log("RENDER")


    console.log("kcal: ", Math.floor(kcal?.sumQuantity?.quantity), "step: ", step?.sumQuantity?.quantity)

    let opacity = useSharedValue(0)



    let [dailyDetail, setDetail] = useState<any>([])


    let [user, setUser] = useState<any>(null)
    let [userDetail, setUserDetail] = useState<any>(null)
    let { currentDate, setCurrentDate } = useCurrentPickDate()
    let [selectDay, setSelectDay] = useState<any>(currentDate)


    useFocusEffect(useCallback(() => {
        (async () => {
            let usr = new User()
            let token = await cookie.getItem("token")

            let decoded = await jwtDecode(token as string)

            setUser(decoded)

            let user_data = await usr.getUserData()


            console.log("USER DATA : ", user_data)

            setUserDetail(user_data)

            let age = dayjs().diff(user_data.dob, 'year')

            let convertDay = dayjs(currentDate).format("YYYY-MM-DD")

            let res = await usr.getDaily(convertDay)

            console.log("ED : ", res)

            if (!user_data.weight || !user_data.height || !user_data.dob || !user_data.sex || !user_data.fast) {
                Alert.alert(t('settingRequired'), '', [
                    {
                        text: t('settingButton'),
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

    useEffect(() => {
        if (!dailyDetail) return;
        if (!kcal_value && !step_value) return; // รอให้มีค่าก่อน

        (async () => {
            let ex = new Excercise();

            console.log("sending:", dailyDetail.id, typeof dailyDetail.id, kcal_value, typeof kcal_value, step_value, typeof step_value)

            let apple_sync = await ex.updateAppleFitness(
                dailyDetail.id,
                kcal_value,
                step_value
            );
            console.log(apple_sync);
        })();
    }, [dailyDetail, kcal_value, step_value]);

    const raw = ((dailyDetail.dailyCalories - dailyDetail.totalCalories + dailyDetail.totalBurned) / dailyDetail.dailyCalories) * 100;
    const remain = Math.min(100, Math.max(0, raw));



    let [dotPosition, setDotPosition] = useState(50)

    let [predictedWeight, setPredictedWeight] = useState(0)

    let [loss, setLoss] = useState(0)


    let [predictDays, setPredictDays] = useState(0)


    let [forecastModal, setForecastModal] = useState(false)

    let foreop = useSharedValue(0)

    useEffect(() => {
        (async () => {
            if (!userDetail) return;



            let s = new Stat()


            let result = await s.predict()


            console.log("Predict Days : ", result)



            let total_week_cal = result.reduce((total: number, item: any) => total + item.value, 0)

            setPredictDays(total_week_cal)

            // console.log("Total Week Calories: ", total_week_cal)

            const genderConstant = userDetail.sex === 'male' ? 5 : -161;


            let age = dayjs().diff(userDetail.dob, 'year')

            const bmr = (10 * userDetail.weight) + (6.25 * userDetail.height) - (5 * age) + genderConstant;

            const tdee = bmr * 1.2;
            const maintain_cal = tdee * 7

            let deficit = total_week_cal - maintain_cal


            let one_kg = 7700

            let loss_res = deficit / one_kg

            setLoss(loss_res)

            const dotPosition_res = Math.max(0, Math.min(((loss_res + 1) / 2) * 100, 100));

            setDotPosition(dotPosition_res);


            console.log("PREDICT Weight : ", userDetail.weight)
        })()
    }, [userDetail])





    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>


            <Animated.View style={useAnimatedStyle(() => ({ opacity: foreop.value }))} className="bg-[#000]/30 flex-1 justify-center items-center absolute top-0 left-0 w-full h-full z-10">
                <View className="bg-white dark:bg-gray-900 w-[88%] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">

                    {/* Header */}
                    <View className="flex-row items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <View className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 items-center justify-center">
                            <Ionicons name="trending-up-outline" size={18} color="#059669" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-[ebold] text-sm text-gray-900 dark:text-white">
                                {t('forecastWeight7Days')}
                            </Text>
                            <Text className="font-[eregular] text-xs text-gray-400 mt-0.5">
                                {t('howCalculation')}
                            </Text>
                        </View>


                        <TouchableOpacity onPress={() => {
                            console.log("Close forecast modal")
                            foreop.value = withTiming(0, { duration: 200 })
                        }} className="p-4 bg-slate-100 rounded-full">
                            <Ionicons name="close" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="max-h-[520px]"
                        contentContainerClassName="px-5 py-4 gap-5"
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Calorie Forecast Method */}
                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="analytics-outline" size={14} color="#059669" />
                                <Text className="font-[emedium] text-sm text-gray-800 dark:text-gray-100">
                                    {t('forecastMethod')}
                                </Text>
                            </View>
                            <Text className="font-[eregular] text-xs text-gray-500 dark:text-gray-400 leading-5">
                                {t('forecastMethodDesc')}
                            </Text>
                            <Text className="font-[eregular] text-xs text-gray-500 dark:text-gray-400 leading-5">
                                {t('forecastMethodDesc2')}
                            </Text>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* BMR Formula */}
                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="calculator-outline" size={14} color="#059669" />
                                <Text className="font-[emedium] text-sm text-gray-800 dark:text-gray-100">
                                    {t('bmrFormula')}
                                </Text>
                                <View className="bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                                    <Text className="font-[eregular] text-[10px] text-gray-400">
                                        Mifflin–St Jeor ²
                                    </Text>
                                </View>
                            </View>

                            {/* Male */}
                            <View className="bg-emerald-50 dark:bg-emerald-900/25 rounded-2xl px-4 py-3">
                                <Text className="font-[emedium] text-[10px] text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-1">
                                    {t('male')}
                                </Text>
                                <Text className="font-[eregular] text-xs text-emerald-900 dark:text-emerald-200 leading-5">
                                    (10 × W) + (6.25 × H) − (5 × A) + 5
                                </Text>
                            </View>

                            {/* Female */}
                            <View className="bg-pink-50 dark:bg-pink-900/25 rounded-2xl px-4 py-3">
                                <Text className="font-[emedium] text-[10px] text-pink-500 dark:text-pink-400 tracking-widest uppercase mb-1">
                                    {t('female')}
                                </Text>
                                <Text className="font-[eregular] text-xs text-pink-900 dark:text-pink-200 leading-5">
                                    (10 × W) + (6.25 × H) − (5 × A) − 161
                                </Text>
                            </View>

                            <Text className="font-[eregular] text-[10px] text-gray-400 dark:text-gray-500">
                                {t('bmrFormulaDesc')}
                            </Text>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* TDEE */}
                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="flame-outline" size={14} color="#059669" />
                                <Text className="font-[emedium] text-sm text-gray-800 dark:text-gray-100">
                                    {t('maintenanceCalories')}
                                </Text>
                            </View>
                            <View className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl overflow-hidden">
                                <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                    <Text className="font-[eregular] text-xs text-gray-500 dark:text-gray-400">
                                        {t('dailyTdee')}
                                    </Text>
                                    <Text className="font-[emedium] text-xs text-gray-800 dark:text-gray-200">
                                        BMR × 1.2
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center px-4 py-3">
                                    <Text className="font-[eregular] text-xs text-gray-500 dark:text-gray-400">
                                        {t('weeklyMaintenance')}
                                    </Text>
                                    <Text className="font-[emedium] text-xs text-gray-800 dark:text-gray-200">
                                        TDEE × 7
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-px bg-gray-100 dark:bg-gray-800" />


                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="scale-outline" size={14} color="#059669" />
                                <Text className="font-[emedium] text-sm text-gray-800 dark:text-gray-100">
                                    {t('stat7Days')}
                                </Text>
                            </View>
                            <View className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl overflow-hidden">
                                <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                    <Text className="font-[emedium] text-xs text-gray-800 dark:text-gray-200">
                                        {t('sumWeeklyCalories')} = {predictDays} kcal
                                    </Text>
                                </View>
                            </View>


                            <View className="flex-row items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-3">
                                <Ionicons name="information-circle-outline" size={14} color="#d97706" style={{ marginTop: 1 }} />
                                <Text className="font-[eregular] text-xs text-amber-700 dark:text-amber-300 leading-5 flex-1">
                                    {t('avgDataInfo')}
                                </Text>
                            </View>

                            {/* Info callout */}
                            <View className="flex-row items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-3">
                                <Ionicons name="information-circle-outline" size={14} color="#d97706" style={{ marginTop: 1 }} />
                                <Text className="font-[eregular] text-xs text-amber-700 dark:text-amber-300 leading-5 flex-1">
                                    {t('clinicalEstimate')}
                                </Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* Weight Change */}
                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="scale-outline" size={14} color="#059669" />
                                <Text className="font-[emedium] text-sm text-gray-800 dark:text-gray-100">
                                    {t('estimatedWeightChange')}
                                </Text>
                            </View>
                            <View className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl overflow-hidden">
                                <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                    <Text className="font-[eregular] text-[10px] text-gray-400 mb-1">
                                        {t('calorieDeficit')}
                                    </Text>
                                    <Text className="font-[emedium] text-xs text-gray-800 dark:text-gray-200">
                                        Weekly Calories − Weekly maintenance
                                    </Text>
                                </View>
                                <View className="px-4 py-3">
                                    <Text className="font-[eregular] text-[10px] text-gray-400 mb-1">
                                        {t('expectedWeightLoss')} (kg)
                                    </Text>
                                    <Text className="font-[emedium] text-xs text-gray-800 dark:text-gray-200">
                                        Calorie balance ÷ 7,700
                                    </Text>
                                </View>
                            </View>

                            {/* Info callout */}
                            <View className="flex-row items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-3">
                                <Ionicons name="information-circle-outline" size={14} color="#d97706" style={{ marginTop: 1 }} />
                                <Text className="font-[eregular] text-xs text-amber-700 dark:text-amber-300 leading-5 flex-1">
                                    {t('clinicalEstimate')}
                                </Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* References */}
                        <View className="gap-2">
                            <Text className="font-[emedium] text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {t('references')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://doi.org/10.1016/S0140-6736(11)60812-X')}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-start gap-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2.5">
                                    <Text className="font-[emedium] text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                                        [1]
                                    </Text>
                                    <Text className="font-[eregular] text-[11px] text-gray-500 dark:text-gray-400 leading-[18px] flex-1">
                                        Hall KD et al. Quantification of the effect of energy imbalance on bodyweight.{' '}
                                        <Text className="italic">Lancet.</Text> 2011;378(9793):826–837
                                    </Text>
                                    <Ionicons name="open-outline" size={12} color="#9ca3af" style={{ marginTop: 2 }} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://doi.org/10.1093/ajcn/51.2.241')}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-start gap-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2.5">
                                    <Text className="font-[emedium] text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                                        [2]
                                    </Text>
                                    <Text className="font-[eregular] text-[11px] text-gray-500 dark:text-gray-400 leading-[18px] flex-1">
                                        Mifflin MD et al. A new predictive equation for resting energy expenditure.{' '}
                                        <Text className="italic">Am J Clin Nutr.</Text> 1990;51(2):241–247
                                    </Text>
                                    <Ionicons name="open-outline" size={12} color="#9ca3af" style={{ marginTop: 2 }} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Disclaimer */}
                        <View className="flex-row items-start gap-2 pb-1">
                            <Ionicons name="alert-circle-outline" size={13} color="#d1d5db" style={{ marginTop: 1 }} />
                            <Text className="font-[eregular] text-[10px] text-gray-300 dark:text-gray-600 leading-[16px] flex-1">
                                {t('disclaimerDesc')}
                            </Text>
                        </View>

                    </ScrollView>
                </View>
            </Animated.View>

            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ 
                    paddingTop: insets.top > 0 ? insets.top : 20, 
                    paddingBottom: insets.bottom > 0 ? insets.bottom + 100 : 120, 
                }}
            >
                <View className="w-full h-[70px] justify-between flex-row px-5">

                    <View className="flex-row items-center gap-2">

                        <Image style={{ width: 60, height: 60 }} source={require("../../../assets/images/rabbit.png")} className="w-full h-full object-cover" />
                        <View>
                            <Text className="font-[mbold] text-2xl text-gray-600">PLAY<Text className="text-amber-500">K</Text><Text className="text-red-500">C</Text><Text className="text-emerald-600">A</Text><Text className="text-blue-400">L</Text></Text>
                            <Text className="font-[mbold] text-md text-gray-600">{t('caloriesDeficitSub')}</Text>
                        </View>

                    </View>


                    <View className="flex flex-row items-center gap-2">
                        <TouchableOpacity className="p-3 bg-slate-200 rounded-2xl" activeOpacity={0.7} onPress={() => {
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


                <View className="w-full bg-white rounded-3xl p-6 my-4 flex items-center justify-center">


                    <View className="w-full flex gap-0 justify-center items-center border border-gray-200 rounded-3xl px-5 py-3 shadow shadow-sm shadow-gray-200">
                        <View className="flex flex-row items-center gap-2 mb-10">
                            {/* Header Title */}
                            <View className="flex justify-center items-center">
                                <Text className="font-[ebold] text-gray-800 text-lg">
                                    {t('forecastWeight')}
                                </Text>
                                <Text className="font-[eregular] mt-[-5px] text-gray-400 text-sm">
                                    {t('basedOn7Days')}
                                </Text>
                            </View>



                            <TouchableOpacity className="absolute right-[-55px]" activeOpacity={0.7} onPress={() => {
                                foreop.value = withTiming(1, { duration: 200 })
                            }}>
                                <Ionicons name="information-circle-outline" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Bar Container */}
                        <View className="w-full my-2 relative mb-4">

                            {/* Colored Bar */}
                            <View className="w-full h-[12px] bg-gray-200 flex flex-row rounded-full overflow-hidden">
                                <View className="w-[25%] h-full bg-green-400" />
                                <View className="w-[25%] h-full bg-blue-400" />
                                <View className="w-[25%] h-full bg-orange-400" />
                                <View className="w-[25%] h-full bg-red-400" />
                            </View>

                            {/* Tooltip showing the exact loss value */}
                            {predictDays > 0 && (
                                <View
                                    className="absolute bg-gray-800 rounded-md px-2 py-1 items-center justify-center shadow-sm"
                                    style={{
                                        left: `${dotPosition}%`,
                                        top: -32,
                                        transform: [{ translateX: -16 }], // ปรับให้กึ่งกลาง (ครึ่งหนึ่งของความกว้างโดยประมาณ)
                                    }}
                                >
                                    <Text className="font-[ebold] text-white text-sm">
                                        {loss > 0 ? '+' : ''}{loss.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {/* Indicator Dot */}
                            <View
                                className="absolute w-5 h-5 bg-white border-[3px] border-gray-800 rounded-full"
                                style={{
                                    left: `${predictDays > 0 ? dotPosition : 50}%`,
                                    top: -4,
                                    transform: [{ translateX: -10 }], // -10 เพื่อให้จุดอยู่กึ่งกลางพอดี (width 20 / 2)
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3,
                                    elevation: 4,
                                }}
                            />

                            {/* Legend labels */}
                            <View className="flex flex-row justify-between mt-3 px-0">
                                {[-1, -0.5, 0, 0.5, 1].map((val) => (
                                    <View key={val} className="w-[20%] items-center" style={{ width: '20%' }}>
                                        {/* การจัดให้อยู่ตรงกลางของแต่ละจุดแบ่ง */}
                                        <Text className="font-[eregular] text-sm text-gray-400">
                                            {val > 0 ? `+${val}` : val}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Footer Result / Info */}
                        <View className="w-full">
                            {predictDays > 0 ? (
                                userDetail ? (
                                    <View className="bg-gray-50 rounded-2xl p-4 items-center w-full">
                                        <Text className="font-[eregular] text-gray-500 text-sm mb-1">
                                            {t('expectedOn')} {dayjs().add(7, 'day').format("DD MMM YYYY")}
                                        </Text>
                                        <View className="flex flex-row items-baseline">
                                            <Text className="font-[ebold] text-gray-800 text-2xl">
                                                {Number(userDetail.weight + loss).toFixed(2)}
                                            </Text>
                                            <Text className="font-[eregular] text-gray-500 text-sm ml-1">kg</Text>
                                        </View>
                                        <Text className="font-[eregular] text-gray-400 text-sm mt-1">
                                            {t('currentWeight', { weight: userDetail.weight })}
                                        </Text>
                                    </View>
                                ) : null
                            ) : (
                                <View className="bg-red-50 rounded-2xl p-4 items-center w-full">
                                    <Text className="font-[eregular] text-red-500 text-sm text-center">
                                        {t('weekCaloriesError')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {calendarModal && (
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: -1000,
                            left: -1000,
                            right: -1000,
                            bottom: -1000,
                            height: 4000,
                            backgroundColor: 'transparent',
                            zIndex: 1,
                        }}
                        onPress={() => {
                            opacity.value = withTiming(0, { duration: 200 })
                            setCalendarModal(false)
                        }}
                    />
                )}

                <Animated.View 
                    pointerEvents={calendarModal ? 'auto' : 'none'}
                    style={[useAnimatedStyle(() => ({ opacity: opacity.value }))]} 
                    className="absolute top-16 left-[30px] border border-gray-200 shadow bg-white z-[2] rounded-xl"
                >
                    <DatePicker 
                        themeVariant="light" 
                        textColor="black" 
                        style={{ backgroundColor: 'white', borderRadius: 12 }} 
                        display="inline" 
                        value={selectDay} 
                        locale={locale === 'th' ? 'th-TH' : 'en-GB'}
                        onChange={(e, d) => {
                            if (d) {
                                setCurrentDate(d)
                            }
                            opacity.value = withTiming(0, { duration: 200 })
                            setCalendarModal(false)
                        }} 
                    />
                </Animated.View>

                <View className="w-full bg-white rounded-3xl p-5 mt-[-20px] my-4 flex flex-row justify-between items-center">

                    {/* Left Side: Calories Gauge */}
                    <View className="w-[45%] flex flex-col justify-center items-center">
                        {/* Main Gauge */}
                        <GaugeCircle
                            size={130}
                            value={remain}
                            startAngle={-210}
                            sweepAngle={240}
                            strokeWidth={12}
                            label={`${(dailyDetail.dailyCalories - dailyDetail.totalCalories) + dailyDetail.totalBurned + dailyDetail.appleBurned}`}
                            color="#10b981"
                        />
                        <Text className="font-[ebold] text-gray-700 mt-[-20px] text-[14px]">{t('remaining')}</Text>
                        <Text className="font-[eregular] text-gray-400 text-[12px] mb-3">{t('kcalLabel')}</Text>

                        {/* Consumed & Burned Stats */}
                        <View className="flex flex-row w-full justify-between px-2 mt-1">
                            <View className="flex flex-col items-center">
                                <Text className="font-[eregular] text-gray-400 text-sm">{t('consumed')}</Text>
                                <Text className="font-[esemibold] text-gray-700 text-md">{dailyDetail.totalCalories}</Text>
                            </View>
                            <View className="w-[1px] bg-gray-200 h-full mx-2"></View>
                            <View className="flex flex-col items-center">
                                <Text className="font-[eregular] text-gray-400 text-sm">{t('burned')}</Text>
                                <Text className="font-[esemibold] text-gray-700 text-md">{dailyDetail.totalBurned + dailyDetail.appleBurned}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Right Side: Macros Progress Bars */}
                    <View className="w-[50%] flex flex-col gap-4">

                        {/* Protein */}
                        <View className="w-full">
                            <View className="flex flex-row justify-between items-end mb-1">
                                <View className="flex flex-row items-center gap-2">
                                    <Image style={{ width: 30, height: 30 }} source={require("../../../assets/images/protein.png")} resizeMode="contain" />
                                    <Text className="font-[esemibold] text-gray-700 text-md">{t('protein')}</Text>
                                </View>
                                <Text className="font-[eregular] text-gray-500 text-[11px]">
                                    {dailyDetail.totalProtein} / {dailyDetail.dailyProtein}g
                                </Text>
                            </View>
                            <View className="w-full h-[8px] bg-gray-100 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-red-600 rounded-full"
                                    style={{ width: `${Math.min((dailyDetail.totalProtein / (dailyDetail.dailyProtein || 1)) * 100, 100)}%` }}
                                />
                            </View>
                        </View>

                        {/* Carbs */}
                        <View className="w-full">
                            <View className="flex flex-row justify-between items-end mb-1">
                                <View className="flex flex-row items-center gap-2">
                                    <Image style={{ width: 30, height: 30 }} source={require("../../../assets/images/rices.png")} resizeMode="contain" />
                                    <Text className="font-[esemibold] text-gray-700 text-md">{t('carbs')}</Text>
                                </View>
                                <Text className="font-[eregular] text-gray-500 text-[11px]">
                                    {dailyDetail.totalCarbs} / {dailyDetail.dailyCarbs}g
                                </Text>
                            </View>
                            <View className="w-full h-[8px] bg-gray-100 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-sky-500 rounded-full"
                                    style={{ width: `${Math.min((dailyDetail.totalCarbs / (dailyDetail.dailyCarbs || 1)) * 100, 100)}%` }}
                                />
                            </View>
                        </View>

                        {/* Fat */}
                        <View className="w-full">
                            <View className="flex flex-row justify-between items-end mb-1">
                                <View className="flex flex-row items-center gap-2">
                                    <Image style={{ width: 30, height: 30 }} source={require("../../../assets/images/cheese.png")} resizeMode="contain" />
                                    <Text className="font-[esemibold] text-gray-700 text-md">{t('fat')}</Text>
                                </View>
                                <Text className="font-[eregular] text-gray-500 text-[11px]">
                                    {dailyDetail.totalFat} / {dailyDetail.dailyFat}g
                                </Text>
                            </View>
                            <View className="w-full h-[8px] bg-gray-100 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${Math.min((dailyDetail.totalFat / (dailyDetail.dailyFat || 1)) * 100, 100)}%` }}
                                />
                            </View>
                        </View>

                    </View>
                </View>

                <View className="flex-1 w-full bg-white pb-40">
                    {/* Header Section */}
                    <View className="mt-6 flex flex-row gap-4 items-center w-full justify-center px-6">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="font-[esemibold] text-gray-400 text-base tracking-wide">{t('foodActivities')}</Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    <View className="w-full flex items-center justify-center mt-2 mb-4">
                        <Text className="font-[medium] text-sm text-gray-500 bg-gray-200/50 px-4 py-1 rounded-full">
                            {dayjs(currentDate).format("DD MMM YYYY")}
                        </Text>
                    </View>

                    {/* Content Section */}
                    <View className="w-full px-5 py-2">
                        {/* Apple Health Card */}
                        {authorizationStatus === 2 && (dailyDetail.appleStep || dailyDetail.appleKcal) ? (
                            <View className="w-full mb-4 p-4 flex flex-row items-center bg-white border border-slate-100 rounded-2xl shadow-sm elevation-2">
                                <View className="w-16 h-16 mr-4 rounded-xl overflow-hidden bg-gray-50 border border-slate-100">
                                    <Image
                                        source={require("../../../assets/images/apple-health.png")}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View className="flex-1">
                                    <View className="flex flex-row items-center justify-between mb-1">
                                        <Text className="text-lg font-[ebold] text-red-700">{t('appleHealth')}</Text>
                                        <Text className="font-[medium] text-sm text-gray-400">{dayjs().format('HH:mm')}</Text>
                                    </View>
                                    <View className="flex flex-row items-center justify-between mt-1">
                                        <View className="flex flex-row items-center gap-1.5">
                                            <Text className="font-[esemibold] text-gray-600 text-base">{dailyDetail.appleStep}</Text>
                                            <Text className="font-[medium] text-gray-400 text-sm mt-0.5">{t('steps')}</Text>
                                        </View>
                                        <View className="flex flex-row items-center gap-1.5">
                                            <Text className="font-[esemibold] text-orange-500 text-base">{dailyDetail.appleBurned}</Text>
                                            <Text className="font-[medium] text-gray-400 text-sm mt-0.5">{t('kcalLabel')}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ) : null}

                        {/* Exercise Logs */}
                        <FlashList
                            data={dailyDetail.exerciseLogs}
                            renderItem={({ item }: any) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium)
                                        router.push(`/ex/${item.id}`)
                                    }}
                                    activeOpacity={0.7}
                                    className="w-full mb-3 p-3 flex flex-row items-center bg-white border border-slate-100 rounded-2xl shadow-sm elevation-1"
                                >
                                    <View className="w-20 h-20 mr-4 rounded-xl bg-slate-50 flex justify-center items-center overflow-hidden border border-slate-100">
                                        {item.img ? (
                                            <Image
                                                source={{ uri: `${public_url}/foods/${item.img}` }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="flex w-full h-full items-center justify-center">
                                                <Image
                                                    source={require('../../../assets/images/running2.png')}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-1 justify-center">
                                        <View className="flex flex-row items-start justify-between mb-2">
                                            <Text numberOfLines={1} className="text-base text-xl font-[esemibold] text-gray-700 flex-1 pr-2">
                                                {item.name}
                                            </Text>
                                            <Text className="font-[medium] text-sm text-gray-400 mt-1">
                                                {dayjs(item.createdAt).format("HH:mm")}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row gap-1.5 items-center">
                                            <Image source={require("../../../assets/images/running.png")} style={{ width: 24, height: 24 }} resizeMode="contain" />
                                            <Text className={`font-[ebold] text-base ${item.quantity <= 0 ? 'line-through text-gray-300' : 'text-emerald-500'}`}></Text>
                                            <Text className="font-[medium] ml-[-10px] text-emerald-500 text-xl">{item.caloriesBurned} {t('kcalLabel')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Food Logs */}
                        <FlashList
                            data={dailyDetail.foodLogs}
                            renderItem={({ item }: any) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium)
                                        router.push(`/product/${item.id}`)
                                    }}
                                    activeOpacity={0.7}
                                    className="w-full mb-3 p-3 flex flex-row items-center bg-white border border-slate-100 rounded-2xl shadow-sm elevation-1"
                                >
                                    <View className="w-20 h-20 mr-4 rounded-xl bg-slate-50 flex justify-center items-center overflow-hidden border border-slate-100">
                                        {item.img ? (
                                            <Image source={{ uri: `${public_url}/foods/${item.img}` }} style={{ width: '100%', height: '100%' }} className="w-full h-full object-cover" />
                                        ) : (
                                            <View className="flex w-full h-full items-center justify-center">
                                                <Image
                                                    source={require('../../../assets/images/eat.png')}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )}
                                    </View>

                                    <View className="flex-1 justify-center gap-y-1">
                                        <View className="flex flex-row items-start justify-between">
                                            <Text numberOfLines={1} className="text-base text-lg font-[esemibold] text-gray-700 flex-1 pr-2">
                                                {item.name}
                                            </Text>
                                            <Text className="font-[medium] text-md text-gray-400 mt-1">
                                                {dayjs(item.createdAt).format("HH:mm")}
                                            </Text>
                                        </View>

                                        <View className="flex flex-row gap-1.5 items-center mb-1">
                                            <Image source={require("../../../assets/images/fire.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                            <Text className={`font-[ebold] text-lg ${item.quantity <= 0 ? 'line-through text-gray-300' : 'text-orange-500'}`}>
                                                {item.calories} <Text className="font-[medium]">{t('kcalLabel')}</Text>
                                            </Text>
                                        </View>

                                        {/* Macros Container */}
                                        <View className="flex flex-row gap-3 items-center">
                                            <View className="flex flex-row items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
                                                <Image source={require("../../../assets/images/protein.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                                <Text className="font-[esemibold] text-red-600 text-md">{item.protein}g</Text>
                                            </View>
                                            <View className="flex flex-row items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
                                                <Image source={require("../../../assets/images/rices.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                                <Text className="font-[esemibold] text-blue-600 text-md">{item.carbs}g</Text>
                                            </View>
                                            <View className="flex flex-row items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                                                <Image source={require("../../../assets/images/cheese.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                                <Text className="font-[esemibold] text-yellow-600 text-md">{item.fat}g</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>


            <TouchableOpacity onPress={() => {
                navigate.push({
                    pathname: "/addItem",
                    params: {
                        dailyLogId: dailyDetail.id
                    }
                })
            }} className="w-[60px] h-[60px] flex justify-center items-center absolute bottom-30 rounded-full right-10 bg-[#F5EBE0] border-gray-400 border-1 shadow shadow-lg" activeOpacity={0.7}>

                <Image source={require("../../../assets/images/carrot.png")} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>




        </View>
    )
}

export default Dashboard