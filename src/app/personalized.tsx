import { useEffect } from "react"
import { Text, View } from "react-native"
import cookie from '@react-native-async-storage/async-storage'
import { router } from "expo-router"

const Personalized = () => {

    useEffect(()=>{
        router.replace("/(tabs)/home")
    }, [])

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text>Personalizing...</Text>
        </View>
    )
}

export default Personalized