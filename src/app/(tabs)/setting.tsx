import { Alert, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import cookie from '@react-native-async-storage/async-storage'
import { useRouter, router } from "expo-router"
import { useMeasureStore } from "@/stores/measure.store"
import * as Linking from 'expo-linking'
import { useHealthkitAuthorization, useMostRecentQuantitySample } from '@kingstinct/react-native-healthkit';



const Setting = () => {

    let navigate = useRouter()
    let { setCurrent } = useMeasureStore()

    const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization({
        toRead: ['HKQuantityTypeIdentifierBloodGlucose', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierStepCount'],
    })

    return (
        <SafeAreaView>
            <View className="p-5 gap-5">

                {/* <Text>{sample?.value} {sample?.unit}</Text> */}


                <TouchableOpacity onPress={async () => {
                    requestAuthorization()
                }} className="w-full h-[45px] bg-white">
                    <Text>Apple Health Connect</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    await cookie.removeItem("token")

                    // Debug - check token is actually removed
                    const check = await cookie.getItem("token")
                    setCurrent(0)

                    router.replace("/")

                }} className="w-full h-[45px] bg-white">
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Setting