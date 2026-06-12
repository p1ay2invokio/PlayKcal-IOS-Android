import { useEffect } from "react"
import { Text, View, ActivityIndicator } from "react-native"
import cookie from '@react-native-async-storage/async-storage'
import { router } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"
import * as StoreReview from 'expo-store-review';
import { useLanguageStore } from "@/stores/language.store";

const Personalized = () => {
    let { reset } = useMeasureStore()
    const { t } = useLanguageStore()

    useEffect(() => {
        (async () => {
            if (await StoreReview.hasAction()) {
                StoreReview.requestReview()
            }
            reset()
            setTimeout(() => {
                router.replace("/(tabs)/home")
            }, 1500)
        })()
    }, [])

    return (
        <View className="flex-1 justify-center items-center bg-white px-8">

            {/* วงกลมล้อมรอบ Spinner ให้ดูพรีเมียมขึ้น */}
            <View className="w-24 h-24 bg-gray-50 rounded-full flex justify-center items-center mb-6 shadow-sm border border-gray-100">
                <ActivityIndicator size="large" color="#1F2937" />
            </View>

            {/* Header Text */}
            <Text className="font-[ebold] text-2xl text-gray-800 text-center mb-3 tracking-wide">
                {t('personalizingPlan')}
            </Text>

            {/* Subtext อธิบายว่ากำลังทำอะไร */}
            <Text className="font-[emedium] text-base text-gray-500 text-center leading-relaxed">
                {t('crunchingNumbers')}
            </Text>

        </View>
    )
}

export default Personalized