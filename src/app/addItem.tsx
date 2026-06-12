import { Text, TouchableOpacity, View, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import Back from "@/components/back"
import { useCameraPermissions } from 'expo-camera'
import { router, useLocalSearchParams, useFocusEffect } from "expo-router"
import { useState, useCallback } from "react"
import { useLanguageStore } from "@/stores/language.store"
import cookie from '@react-native-async-storage/async-storage'

const AddItem = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    let { dailyLogId } = useLocalSearchParams()
    let [select, setSelect] = useState("food")
    const { t } = useLanguageStore()

    const [favFoods, setFavFoods] = useState<any[]>([])
    const [favExercises, setFavExercises] = useState<any[]>([])

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const foodStr = await cookie.getItem("favorite_foods")
                setFavFoods(foodStr ? JSON.parse(foodStr) : [])

                const exStr = await cookie.getItem("favorite_exercises")
                setFavExercises(exStr ? JSON.parse(exStr) : [])
            } catch (e) {
                console.error(e)
            }
        })()
    }, []))

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View className="flex-row items-center gap-4 mb-6">
                    <Back />
                    <Text className="font-[ebold] text-2xl text-gray-800">{t('addEntryTitle')}</Text>
                </View>

                {/* Custom Segmented Control (Tabs) */}
                <View className="bg-gray-100 rounded-2xl p-1 flex-row mb-6">
                    <TouchableOpacity
                        onPress={() => setSelect("food")}
                        activeOpacity={0.8}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${select === "food" ? 'bg-white shadow-sm shadow-gray-200' : ''}`}
                    >
                        <Text className={`font-[ebold] text-base ${select === "food" ? 'text-gray-900' : 'text-gray-400'}`}>
                            {t('foodTab')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelect("exercise")}
                        activeOpacity={0.8}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${select === "exercise" ? 'bg-white shadow-sm shadow-gray-200' : ''}`}
                    >
                        <Text className={`font-[ebold] text-base ${select === "exercise" ? 'text-gray-900' : 'text-gray-400'}`}>
                            {t('exerciseTab')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                {select === "food" ? (
                    <View className="gap-6">
                        {/* Cards Group */}
                        <View className="gap-4">
                            {/* AI Scan Food Card */}
                            <TouchableOpacity
                                className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-[24px] p-4 flex-row items-center"
                                activeOpacity={0.7}
                                onPress={async () => {
                                    let res = await requestCameraPermission()
                                    if (res.status === "granted") {
                                        router.push("/scan")
                                    }
                                }}
                            >
                                <View className="w-14 h-14 bg-purple-50 rounded-full flex justify-center items-center mr-4">
                                    <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/gemini-color.png')} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-[ebold] text-gray-800 text-lg">{t('aiScanFood')}</Text>
                                    <Text className="font-[emedium] text-gray-400 text-sm">{t('detectCalCamera')}</Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                            </TouchableOpacity>

                            {/* Manual Add Food Card */}
                            <TouchableOpacity
                                className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-[24px] p-4 flex-row items-center"
                                activeOpacity={0.7}
                                onPress={() => router.push(`/manual/${dailyLogId}`)}>
                                <View className="w-14 h-14 bg-gray-50 rounded-full flex justify-center items-center mr-4">
                                    <Icon name="archive-outline" size={24} color="#4B5563" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-[ebold] text-gray-800 text-lg">{t('manualEntry')}</Text>
                                    <Text className="font-[emedium] text-gray-400 text-sm">{t('typeToSearch')}</Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                            </TouchableOpacity>
                        </View>

                        {/* Favorites Section */}
                        <View className="gap-4">
                            <View className="flex-row items-center gap-2">
                                <Icon name="star" size={18} color="#D97706" />
                                <Text className="font-[ebold] text-lg text-gray-800">{t('favoriteTitle')}</Text>
                            </View>

                            {favFoods.length === 0 ? (
                                <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100 items-center justify-center">
                                    <Text className="font-[emedium] text-slate-400 text-sm">{t('noFavorites')}</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {favFoods.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                router.push({
                                                    pathname: "/manual/[id]",
                                                    params: {
                                                        id: String(dailyLogId),
                                                        name: item.name,
                                                        qty: String(item.quantity),
                                                        kcal: String(item.calories),
                                                        protein: String(item.protein),
                                                        carbs: String(item.carbs),
                                                        fat: String(item.fat)
                                                    }
                                                })
                                            }}
                                            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex-row justify-between items-center"
                                        >
                                            <View className="flex-1 gap-1">
                                                <Text className="font-[ebold] text-slate-800 text-base" numberOfLines={1}>
                                                    {item.name}
                                                </Text>
                                                <Text className="font-[emedium] text-slate-400 text-xs">
                                                    {item.quantity} {t('portion')} • {item.calories} {t('kcalLabel')}
                                                </Text>
                                            </View>
                                            <Icon name="add-circle" size={26} color="#10B981" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                ) : (
                    <View className="gap-6">
                        {/* Cards Group */}
                        <View className="gap-4">
                            {/* AI Scan Exercise Card */}
                            <TouchableOpacity
                                className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-[24px] p-4 flex-row items-center"
                                activeOpacity={0.7}
                                onPress={async () => {
                                    let res = await requestCameraPermission()
                                    if (res.status === "granted") {
                                        router.push({
                                            pathname: '/exercise',
                                            params: { id: dailyLogId }
                                        })
                                    }
                                }}
                            >
                                <View className="w-14 h-14 bg-purple-50 rounded-full flex justify-center items-center mr-4">
                                    <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/gemini-color.png')} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-[ebold] text-gray-800 text-lg">{t('aiEstimateBurn')}</Text>
                                    <Text className="font-[emedium] text-gray-400 text-sm">{t('scanMachineActivity')}</Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                            </TouchableOpacity>

                            {/* Manual Add Exercise Card */}
                            <TouchableOpacity
                                className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-[24px] p-4 flex-row items-center"
                                activeOpacity={0.7}
                                onPress={async () => {
                                    let res = await requestCameraPermission()
                                    if (res.status === "granted") {
                                        router.push(`/exm/${dailyLogId}`)
                                    }
                                }}
                            >
                                <View className="w-14 h-14 bg-gray-50 rounded-full flex justify-center items-center mr-4">
                                    <Icon name="barbell-outline" size={26} color="#4B5563" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-[ebold] text-gray-800 text-lg">{t('manualEntry')}</Text>
                                    <Text className="font-[emedium] text-gray-400 text-sm">{t('logWorkoutDetails')}</Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                            </TouchableOpacity>
                        </View>

                        {/* Favorites Section */}
                        <View className="gap-4">
                            <View className="flex-row items-center gap-2">
                                <Icon name="star" size={18} color="#D97706" />
                                <Text className="font-[ebold] text-lg text-gray-800">{t('favoriteTitle')}</Text>
                            </View>

                            {favExercises.length === 0 ? (
                                <View className="bg-slate-50 rounded-3xl p-6 border border-slate-100 items-center justify-center">
                                    <Text className="font-[emedium] text-slate-400 text-sm">{t('noFavorites')}</Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {favExercises.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                router.push({
                                                    pathname: "/exm/[id]",
                                                    params: {
                                                        id: String(dailyLogId),
                                                        activity: item.activity,
                                                        caloriesBurned: String(item.caloriesBurned)
                                                    }
                                                })
                                            }}
                                            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex-row justify-between items-center"
                                        >
                                            <View className="flex-1 gap-1">
                                                <Text className="font-[ebold] text-slate-800 text-base" numberOfLines={1}>
                                                    {item.activity}
                                                </Text>
                                                <Text className="font-[emedium] text-slate-400 text-xs">
                                                    {item.caloriesBurned} {t('kcalLabel')}
                                                </Text>
                                            </View>
                                            <Icon name="add-circle" size={26} color="#10B981" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddItem