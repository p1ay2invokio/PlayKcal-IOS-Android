import { Food } from "@/class/food.class"
import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { public_url } from "../../../config"
import Icon from "@expo/vector-icons/Ionicons"



const Product = () => {


    let { id } = useLocalSearchParams()

    console.log(id)

    let [select, setSelect] = useState<any>(null)

    useEffect(() => {
        (async () => {
            let f = new Food()

            let foodItem = await f.getFoodById(Number(id))


            console.log(foodItem)
            setSelect(foodItem)
        })()
    }, [])

    if (!select) {
        return null
    }

    return (
        <View className="bg-white flex-1">
            <Image style={{ width: '100%', height: 150 }} source={{ uri: `${public_url}/foods/${select?.img}` }}></Image>
            <View className="p-5">
                <Text className="font-[medium] text-2xl" style={{ lineHeight: 30 }}>{select?.name}</Text>

                <View className="w-full px-6 py-4 flex flex-row justify-between items-center border border-gray-300 rounded-2xl mt-3">
                    <View className="flex flex-row items-center gap-2">
                        <Icon name="nutrition-outline" size={24} color="#4B5563"></Icon>
                        <Text className="font-[ebold] text-xl text-gray-700">Portion</Text>
                    </View>
                    <Text className="font-[ebold] text-xl text-gray-700">{select?.quantity}</Text>
                </View>

                <View className="w-full px-6 py-4 flex flex-row justify-between items-center border border-gray-300 rounded-2xl mt-3">
                    <View className="flex flex-row items-center gap-2">
                        <Image style={{ width: 24, height: 24 }} source={require('../../../assets/images/fire.png')}></Image>
                        <Text className="font-[ebold] text-xl text-gray-700">Kcal</Text>
                    </View>
                    <Text className="font-[ebold] text-xl text-gray-700">{select?.calories}</Text>
                </View>

                <View className="w-full flex flex-row gap-3 mt-3">
                    {/* Protein */}
                    <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                        <Text className="font-[emedium] text-sm text-gray-500">Protein</Text>
                        <Text className="font-[ebold] text-xl text-gray-700">{select?.protein}g</Text>
                    </View>

                    {/* Carbs */}
                    <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                        <Text className="font-[emedium] text-sm text-gray-500">Carbs</Text>
                        <Text className="font-[ebold] text-xl text-gray-700">{select?.carbs}g</Text>
                    </View>

                    {/* Fat */}
                    <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                        <Text className="font-[emedium] text-sm text-gray-500">Fat</Text>
                        <Text className="font-[ebold] text-xl text-gray-700">{select?.fat}g</Text>
                    </View>


                </View>

            </View>
            <View className="w-full items-center flex-1">
                <TouchableOpacity

                    activeOpacity={0.85}
                    className="w-[80%] rounded-2xl py-3 items-center justify-center bg-green-600 absolute bottom-20"
                >
                    <Text className="text-white font-[ebold] text-base text-[20px] tracking-wide">
                        Save Data
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Product