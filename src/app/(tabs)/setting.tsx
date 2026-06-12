import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, Touchable, TouchableOpacity, View, Modal, ActivityIndicator } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
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
import { useLanguageStore } from "@/stores/language.store"
import { SUPPORTED_LANGUAGES } from "@/constants/translations"
import Constants from 'expo-constants'

const Setting = () => {
    let navigate = useRouter()
    let { setCurrent, reset } = useMeasureStore()
    const { locale, setLocale, t } = useLanguageStore()
    const insets = useSafeAreaInsets()
    const appVersion = Constants.expoConfig?.version || '1.0.0'
    const [languageLoading, setLanguageLoading] = useState(false)

    const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization({
        toRead: ['HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierStepCount'],
    })

    let [user, setUser] = useState<any>(null)
    const [bmr, setBmr] = useState(0);

    const [modal, setModal] = useState<"bmr" | "tdee" | "kgweek" | null>(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
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
            {/* Language loading overlay */}
            {languageLoading && (
                <View style={{ zIndex: 9999 }} className="w-full h-full absolute bg-black/50 flex justify-center items-center">
                    <View className="bg-white rounded-3xl p-6 items-center shadow-lg gap-4">
                        <ActivityIndicator size="large" color="#d97706" />
                        <Text className="font-[ebold] text-slate-800 text-base">
                            {locale === 'th' ? 'กำลังเปลี่ยนภาษา...' : 'Changing language...'}
                        </Text>
                    </View>
                </View>
            )}
            {modal ? <View className="w-full h-full bg-gray-500/20 absolute top-0 left-0 z-10 justify-center items-center">
                {modal === "bmr" ? <View className="w-[85%] bg-white rounded-2xl p-5">
                    <View className="gap-3">
                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2 z-1">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[ebold] text-lg mt-4">{t('bmrCalcMethod')}</Text>

                        {/* Male */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">{t('male')}</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">BMR = 10W + 6.25H − 5A + 5</Text>
                            </View>
                        </View>

                        {/* Female */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">{t('female')}</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">BMR = 10W + 6.25H − 5A − 161</Text>
                            </View>
                        </View>

                        {/* Variables */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">{t('variables')}</Text>
                            <Text className="font-[emedium] text-gray-600">W = {t('weight')} (kg)</Text>
                            <Text className="font-[emedium] text-gray-600">H = {t('height')} (cm)</Text>
                            <Text className="font-[emedium] text-gray-600">A = {t('age')} ({t('yrs')})</Text>
                        </View>

                        {/* Reference */}
                        <View className="border-t border-gray-200 pt-3 gap-1">
                            <Text className="font-[ebold] text-sm text-gray-500">{t('references')}</Text>
                            <Text className="font-[emedium] text-xs text-gray-400">
                                Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals.
                                Am J Clin Nutr. 1990;51(2):241–247.
                            </Text>
                            <Link href="https://pubmed.ncbi.nlm.nih.gov/2305711/">
                                <Text className="font-[emedium] text-xs text-blue-400">https://pubmed.ncbi.nlm.nih.gov/2305711/</Text>
                            </Link>
                        </View>
                    </View>
                </View> : modal === "tdee" ? <View className="w-[85%] bg-white rounded-2xl p-5">
                    <View className="gap-3 ">
                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2 z-1">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[ebold] text-lg mt-4">{t('tdeeCalcMethod')}</Text>

                        <Text className="font-[emedium] text-gray-600 text-sm">
                            {t('tdeeCalcDesc')}
                        </Text>

                        {/* Formula */}
                        <View className="gap-1">
                            <Text className="font-[ebold] text-base">{t('formula')}</Text>
                            <View className="bg-gray-100 rounded-xl p-3">
                                <Text className="font-[emedium]">TDEE = BMR × Activity Factor</Text>
                            </View>
                        </View>

                        {/* Activity Factors */}
                        <View className="gap-2">
                            <Text className="font-[ebold] text-base">{t('activityFactors')}</Text>
                            {[
                                { label: t('sedentary'), desc: t('sedentaryDesc'), value: "1.2" },
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
                            <Text className="font-[ebold] text-sm text-gray-500">{t('references')}</Text>
                            <Text className="font-[emedium] text-xs text-gray-400">
                                Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247.
                            </Text>
                            <Link href="https://pubmed.ncbi.nlm.nih.gov/2305711/" asChild>
                                <Text className="font-[emedium] text-xs text-blue-400 underline">https://pubmed.ncbi.nlm.nih.gov/2305711/</Text>
                            </Link>
                        </View>
                    </View>
                </View> : modal === "kgweek" ? <View className="w-[85%] bg-white rounded-2xl p-5">
                    <View className="gap-3">
                        <TouchableOpacity onPress={() => {
                            setModal(null)
                        }} className="absolute bg-gray-300 rounded-full right-0 top-0 p-2 z-1">
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        <Text className="font-[ebold] text-lg mt-4">{t('estimatedWeightChange')}</Text>

                        <Text className="font-[emedium] text-gray-600 text-sm">
                            {t('weightChangeDesc')}
                        </Text>

                        {/* Key Fact */}
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 gap-1">
                            <Text className="font-[ebold] text-sm text-blue-700">{t('keyEstimate')}</Text>
                            <Text className="font-[emedium] text-xs text-blue-600">
                                {t('keyEstimateDesc')}
                            </Text>
                        </View>

                        {/* References */}
                        <View className="border-t border-gray-200 pt-3 gap-3">
                            <Text className="font-[ebold] text-sm text-gray-500">{t('references')}</Text>

                            <View className="gap-1">
                                <Text className="font-[ebold] text-xs text-gray-600">Centers for Disease Control and Prevention (CDC)</Text>
                                <Text className="font-[emedium] text-xs text-gray-400">
                                    {t('cdcDesc')}
                                </Text>
                            </View>

                            <View className="gap-1">
                                <Text className="font-[ebold] text-xs text-gray-600">NHS (National Health Service)</Text>
                                <Text className="font-[emedium] text-xs text-gray-400">
                                    {t('nhsDesc')}
                                </Text>
                            </View>
                        </View>

                        {/* Disclaimer */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <Text className="font-[ebold] text-sm text-yellow-700 mb-1">{t('disclaimer')}</Text>
                            <Text className="font-[emedium] text-xs text-yellow-600">
                                {t('disclaimerDesc')}
                            </Text>
                        </View>
                    </View>
                </View> : null}
            </View> : null}

            {/* Language Selection Modal */}
            <Modal
                visible={dropdownOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownOpen(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/40 justify-end"
                    onPress={() => setDropdownOpen(false)}
                >
                    <Pressable 
                        className="bg-white rounded-t-[24px] p-6 pb-10 gap-5"
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text className="font-[ebold] text-lg text-slate-800">
                                {t('language')}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setDropdownOpen(false)}
                                className="bg-slate-100 rounded-full p-1.5"
                            >
                                <Ionicons name="close" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Options List */}
                        <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                            <View className="gap-2.5">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.code}
                                        onPress={async () => {
                                            setDropdownOpen(false)
                                            setLanguageLoading(true)
                                            await setLocale(lang.code)
                                            setTimeout(() => {
                                                setLanguageLoading(false)
                                            }, 600)
                                        }}
                                        className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                                            locale === lang.code 
                                                ? 'bg-amber-50/50 border-amber-500' 
                                                : 'bg-slate-50/50 border-slate-100'
                                        }`}
                                    >
                                        <Text className={`font-[ebold] text-base ${
                                            locale === lang.code ? 'text-amber-700' : 'text-slate-700'
                                        }`}>
                                            {lang.label}
                                        </Text>
                                        {locale === lang.code && (
                                            <Ionicons name="checkmark-circle" size={22} color="#d97706" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>

            <ScrollView 
                style={{ flex: 1, backgroundColor: 'white' }}
                contentContainerStyle={{ 
                    paddingTop: insets.top > 0 ? insets.top : 20, 
                    paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 100, 
                }}
            >
                <View className="p-5 mt-[-50px] gap-5 items-center w-full bg-white">
                    {menuOpen && (
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
                                opa.value = withTiming(0, { duration: 200 })
                                setMenuOpen(false)
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => {
                        const target = !menuOpen
                        opa.value = withTiming(target ? 1 : 0, { duration: 200 })
                        setMenuOpen(target)
                    }} className="absolute right-10 top-5 z-[2]">
                        <Ionicons name="ellipsis-horizontal-outline" size={24} color="gray" />
                    </TouchableOpacity>

                    <Animated.View 
                        pointerEvents={menuOpen ? 'auto' : 'none'}
                        style={useAnimatedStyle(() => ({ opacity: opa.value }))} 
                        className="w-[150px] bg-white border border-gray-300 rounded-2xl absolute right-10 top-12 z-[2] shadow"
                    >
                        <TouchableOpacity onPress={() => {
                            opa.value = withTiming(0, { duration: 200 })
                            setMenuOpen(false)

                            Alert.alert(
                                t('deleteAccountConfirm'),
                                t('deleteAccountDesc'),
                                [
                                    {
                                        text: t('cancel'),
                                        style: "cancel"
                                    },
                                    {
                                        text: t('delete'),
                                        style: "destructive",
                                        onPress: async () => {
                                            let u = new User()
                                            let res = await u.deleteAccount()

                                            if (res === 'deleted') {
                                                Alert.alert(t('deletingAccount'))
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
                            <Text className="font-[ebold] text-red-400">{t('deleteAccount')}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {user && user.image ? <Image source={{ uri: user.image }} style={{ width: 100, height: 100, borderRadius: 100 }} /> : <View className="w-[100px] h-[100px] bg-gray-200 rounded-full"></View>}

                    {user && user.name ? <Text className="font-[ebold] text-2xl text-gray-600">{user?.name}</Text> : <Text className="font-[ebold] text-2xl text-gray-600">Apple User</Text>}

                    <TouchableOpacity onPress={async () => {
                        requestAuthorization()
                    }} disabled={authorizationStatus === 2 ? true : false} className={`w-full h-[60px] ${authorizationStatus === 2 ? 'bg-green-50 border border-green-300' : 'bg-white border border-gray-200'} rounded-2xl px-6 items-center justify-start gap-5 flex flex-row`}>
                        <Image source={require("../../../assets/images/health.png")} style={{ width: 40, height: 40, borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 5 }} />

                        <View>
                            <View className="flex flex-row gap-2 items-center">
                                <Text className={`font-[ebold] ${authorizationStatus === 2 ? 'text-green-700' : 'text-gray-600'}`}>{t('appleHealthConnect')}</Text>
                                <Image source={require("../../../assets/images/check.png")} style={{ width: 15, height: 15 }} />
                            </View>
                            <Text className={`font-[emedium] text-sm ${authorizationStatus === 2 ? 'text-green-700' : 'text-gray-600'}`}>{t('appleHealthDesc')}</Text>
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
                            <Text className="font-[ebold] text-lg text-slate-800">{t('basicDetails')}</Text>
                        </View>

                        {/* Grid ข้อมูลส่วนตัว 2x2 */}
                        <View className="flex flex-row flex-wrap justify-between gap-y-3 w-full">
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">{t('age')}</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{dayjs().diff(user?.dob, 'year')} <Text className="font-[medium] text-xs">{t('yrs')}</Text></Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">{t('gender')}</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.sex === 'male' ? t('male') : user?.sex === 'female' ? t('female') : user?.sex}</Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">{t('weight')}</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.weight} <Text className="font-[medium] text-xs">{t('kg')}</Text></Text>
                            </View>
                            <View className="w-[48%] bg-slate-50/70 border border-slate-100 rounded-2xl py-3 flex items-center justify-center">
                                <Text className="font-[medium] text-xs text-slate-400 mb-0.5">{t('height')}</Text>
                                <Text className="font-[ebold] text-base text-slate-700">{user?.height} <Text className="font-[medium] text-xs">{t('cm')}</Text></Text>
                            </View>
                        </View>

                        {/* เส้นคั่น */}
                        <View className="w-full h-[1px] bg-slate-100 my-5" />

                        {/* --- ส่วนที่ 2: Formula Details --- */}
                        <View className="flex flex-row gap-2 items-center mb-4">
                            <View className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Ionicons name="body" size={18} color="#10b981" />
                            </View>
                            <Text className="font-[ebold] text-lg text-slate-800">{t('formulaDetails')}</Text>
                        </View>

                        {/* List การเผาผลาญ */}
                        <View className="flex gap-y-3 w-full px-1">
                            <View className="flex flex-row items-center justify-between w-full">
                                <View className="flex flex-row items-center gap-2">
                                    <Text className="font-[esemibold] text-slate-500">{t('bmr')}</Text>
                                    <TouchableOpacity onPress={() => setModal("bmr")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Ionicons name="information-circle" size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="font-[ebold] text-slate-700">{bmr.toFixed(0)} <Text className="font-[medium] text-xs text-slate-400">{t('kcal')}</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <View className="flex flex-row items-center gap-2">
                                    <Text className="font-[esemibold] text-slate-500">{t('tdee')}</Text>
                                    <TouchableOpacity onPress={() => setModal("tdee")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Ionicons name="information-circle" size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="font-[ebold] text-slate-700">{Math.round(bmr * 1.2)} <Text className="font-[medium] text-xs text-slate-400">{t('kcal')}</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <Text className="font-[esemibold] text-slate-500">{t('calorieDeficit')}</Text>
                                <Text className="font-[ebold] text-orange-500">-{user?.fast} <Text className="font-[medium] text-xs text-orange-400">{t('kcal')}</Text></Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full">
                                <Text className="font-[esemibold] text-slate-500">{t('targetIntake')}</Text>
                                <Text className="font-[ebold] text-emerald-500">{Math.round(bmr * 1.2) - user?.fast} <Text className="font-[medium] text-xs text-emerald-400">{t('kcalDay')}</Text></Text>
                            </View>
                        </View>

                        {/* --- ส่วนที่ 3: Result Banner --- */}
                        <View className="mt-5 w-full bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-row justify-between items-center">
                            <View>
                                <Text className="font-[medium] text-xs text-rose-400 mb-1">{t('expectedWeightLoss')}</Text>
                                <Text className="text-xl font-[ebold] text-rose-600">
                                    -{user?.fast >= 500 ? '0.45' :
                                        user?.fast >= 400 ? '0.36' :
                                            user?.fast >= 300 ? '0.27' :
                                                user?.fast >= 200 ? '0.18' :
                                                    user?.fast >= 100 ? '0.09' : '0'} <Text className="text-sm font-[esemibold]">{t('kgPerWeek')}</Text>
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

                    {/* Language Selector Dropdown */}
                    <View className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-sm elevation-2">
                        <TouchableOpacity
                            onPress={() => setDropdownOpen(true)}
                            activeOpacity={0.7}
                            className="w-full flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                                    <Ionicons name="language" size={18} color="#d97706" />
                                </View>
                                <Text className="font-[ebold] text-slate-800 text-base">{t('language')}</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Text className="font-[esemibold] text-sm text-gray-500">
                                    {SUPPORTED_LANGUAGES.find(lang => lang.code === locale)?.label || 'English'}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="gray" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Version Card */}
                    <View className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-sm elevation-2 flex-row justify-between items-center">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <Ionicons name="information-circle" size={18} color="#2563eb" />
                            </View>
                            <View>
                                <Text className="font-[ebold] text-slate-800 text-base">{t('appVersion')}</Text>
                                <Text className="font-[emedium] text-xs text-slate-400 mt-0.5">{t('appVersionDesc')}</Text>
                            </View>
                        </View>
                        <View className="bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                            <Text className="font-[ebold] text-sm text-blue-700">v{appVersion}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={async () => {
                        await cookie.removeItem("token")
                        reset()
                        router.replace("/")
                    }} className="w-full h-[60px] flex-row bg-white rounded-2xl border border-gray-200 px-6 items-center gap-2 justify-start flex">
                        <Ionicons name="log-out-outline" size={24} color="#4b5563" />
                        <Text className="font-[ebold]">{t('signOut')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default Setting