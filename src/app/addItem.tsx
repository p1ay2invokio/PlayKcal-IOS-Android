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
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View className="flex-1 px-6 pt-2">

                {/* Header Section */}
                <View className="flex-row items-center gap-4 mb-6">
                    <Back />
                    <Text className="font-[ebold] text-2xl text-gray-800">Add Entry</Text>
                </View>

                {/* Custom Segmented Control (Tabs) */}
                <View className="bg-gray-100 rounded-2xl p-1 flex-row mb-6">
                    <TouchableOpacity
                        onPress={() => setSelect("food")}
                        activeOpacity={0.8}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${select === "food" ? 'bg-white shadow-sm shadow-gray-200' : ''}`}
                    >
                        <Text className={`font-[ebold] text-base ${select === "food" ? 'text-gray-900' : 'text-gray-400'}`}>
                            Food
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelect("exercise")}
                        activeOpacity={0.8}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${select === "exercise" ? 'bg-white shadow-sm shadow-gray-200' : ''}`}
                    >
                        <Text className={`font-[ebold] text-base ${select === "exercise" ? 'text-gray-900' : 'text-gray-400'}`}>
                            Exercise
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                {select === "food" ? (
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
                                <Text className="font-[ebold] text-gray-800 text-lg">AI Scan Food</Text>
                                <Text className="font-[emedium] text-gray-400 text-sm">Detect calories with camera</Text>
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
                                <Text className="font-[ebold] text-gray-800 text-lg">Manual Entry</Text>
                                <Text className="font-[emedium] text-gray-400 text-sm">Type to search or add custom</Text>
                            </View>
                            <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                    </View>
                ) : (
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
                                <Text className="font-[ebold] text-gray-800 text-lg">AI Estimate Burn</Text>
                                <Text className="font-[emedium] text-gray-400 text-sm">Scan machine or activity</Text>
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
                                <Icon name="barbell-outline" size={26} color="#4B5563" /> {/* ใช้ไอคอนดัมเบลถ้ามี หรือใช้ archive-outline แบบเดิมก็ได้ */}
                            </View>
                            <View className="flex-1">
                                <Text className="font-[ebold] text-gray-800 text-lg">Manual Entry</Text>
                                <Text className="font-[emedium] text-gray-400 text-sm">Log your workout details</Text>
                            </View>
                            <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                    </View>
                )}

            </View>
        </SafeAreaView>
    )
}


export default AddItem