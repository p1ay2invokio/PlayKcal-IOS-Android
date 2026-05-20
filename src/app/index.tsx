import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import cookie from '@react-native-async-storage/async-storage'

export default function Splash() {

    useEffect(() => {
        (async () => {
            const token = await cookie.getItem("token")
            if (token) {
                router.replace("/(tabs)/home")
            } else {
                router.replace("/register")
            }
        })()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    )
}