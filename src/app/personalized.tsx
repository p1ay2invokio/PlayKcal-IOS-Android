import { useEffect } from "react"
import { Text, View } from "react-native"
import cookie from '@react-native-async-storage/async-storage'
import { router } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"
import * as StoreReview from 'expo-store-review';

const Personalized = () => {


    let { reset } = useMeasureStore()

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
        <View className="flex-1 justify-center items-center bg-white">
            <Text>Personalizing...</Text>
        </View>
    )
}

export default Personalized