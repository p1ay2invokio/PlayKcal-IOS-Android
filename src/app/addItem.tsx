import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import Back from "@/components/back"
import { useCameraPermissions } from 'expo-camera'
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"

const AddItem = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    let { dailyLogId } = useLocalSearchParams()

    let [select, setSelect] = useState("food")

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, gap: 10, backgroundColor: "white" }}>

            <View className="flex flex-row gap-2 mb-5">
                <Back></Back>
                <Text className="font-[ebold] text-xl">Add Things</Text>
            </View>



            <View className=" border rounded-2xl border-gray-200 flex-row flex gap-2 justify-center items-center">
                <TouchableOpacity onPress={() => setSelect("food")} className={`flex-1 py-3 items-center justify-center ${select == "food" ? 'from-blue-500/20 to-purple-500/20 bg-linear-to-r rounded-2xl  items-center' : ''}`}>
                    <Text className="font-[ebold]">Food</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelect("exercise")} className={`flex-1 items-center py-3 justify-center ${select == "exercise" ? 'from-blue-500/20 to-purple-500/20 bg-linear-to-r rounded-2xl  items-center' : ''}`}>
                    <Text className="font-[ebold]">Excercise</Text>
                </TouchableOpacity>
            </View>

            {select === "food" ? <View className="flex gap-3">
                <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={async () => {
                    let res = await requestCameraPermission()

                    if (res.status === "granted") {
                        router.push("/scan")
                    }
                    console.log(res)
                }}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/gemini-color.png')}></Image>
                    <Text className="font-[ebold] text-gray-700 text-lg">Scan Food</Text>
                </TouchableOpacity>


                <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={() => {
                    router.push(`/manual/${dailyLogId}`)
                }}>
                    <Icon name="archive-outline" size={24}></Icon>
                    <Text className="font-[ebold] text-gray-700 text-lg">Manually Add</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={() => {
                    console.log("Item added");
                }}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/heart.png')}></Image>
                    <Text className="font-[ebold] text-gray-700 text-lg">Add My Favorites</Text>
                </TouchableOpacity> */}
            </View> : <View>

                <View className="flex gap-3">
                    <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={async () => {
                        let res = await requestCameraPermission()

                        if (res.status === "granted") {
                            router.push({
                                pathname: '/exercise',
                                params: { id: dailyLogId }
                            })
                        }
                        console.log(res)
                    }}>
                        <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/gemini-color.png')}></Image>
                        <Text className="font-[ebold] text-gray-700 text-lg">Add Exercise</Text>
                    </TouchableOpacity>


                    <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={async () => {
                        let res = await requestCameraPermission()

                        if (res.status === "granted") {
                            router.push(`/exm/${dailyLogId}`)
                        }
                        console.log(res)
                    }}>
                        <Icon name="archive-outline" size={24}></Icon>
                        <Text className="font-[ebold] text-gray-700 text-lg">Add Manually Exercise</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </SafeAreaView>
    )
}


export default AddItem