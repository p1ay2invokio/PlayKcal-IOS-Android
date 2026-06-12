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
                const hasSeenOnboarding = await cookie.getItem("hasSeenOnboarding")
                if (hasSeenOnboarding === "true") {
                    router.replace("/register")
                } else {
                    router.replace("/onboarding")
                }
            }
        })()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size="large" color="#f59e0b" />
        </View>
    )
}