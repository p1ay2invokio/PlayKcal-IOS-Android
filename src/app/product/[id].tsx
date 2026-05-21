import { Food } from "@/class/food.class"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { public_url } from "../../../config"
import Icon from "@expo/vector-icons/Ionicons"
import Animated, { useSharedValue, withSpring } from "react-native-reanimated"



const Product = () => {


    let { id } = useLocalSearchParams()

    console.log(id)


    let anim_opa = useSharedValue(0)

    let [select, setSelect] = useState<any>(null)

    let [portion, setPortion] = useState('')
    let [kcal, setKcal] = useState('')
    let [protein, setProtein] = useState('')
    let [carbs, setCarbs] = useState('')
    let [fat, setFat] = useState('')
    let [name, setName] = useState('')
    let [nameTemp, setNameTemp] = useState('')

    let [modalName, setModalName] = useState(false)

    let op_name = useSharedValue(0)

    useEffect(() => {
        (async () => {
            let f = new Food()

            let foodItem = await f.getFoodById(Number(id))


            console.log(foodItem)
            setSelect(foodItem)
            setProtein(foodItem.protein)
            setCarbs(foodItem.carbs)
            setFat(foodItem.fat)
            setKcal(foodItem.calories)
            setPortion(foodItem.quantity)
            setName(foodItem.name)
            setNameTemp(foodItem.name)
        })()
    }, [])

    if (!select) {
        return null
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white flex-1">

                <Animated.View style={{ opacity: op_name }} className="w-full h-full absolute top-0 left-0 bg-[#000000]/50 z-11 flex justify-center items-center">
                    <View className="px-8 py-12 border border-gray-300 sahdow-sm bg-white flex justify-center items-center rounded-2xl">
                        <TextInput textAlign="center" value={nameTemp} onChangeText={(text) => {
                            setNameTemp(text)
                        }} style={{ includeFontPadding: false, lineHeight: 30 }} className="w-[200px] font-[medium] text-2xl h-[45px] border-gray-200 border rounded-xl"></TextInput>
                        <View className="flex flex-row gap-4">
                            <TouchableOpacity onPress={() => {
                                Keyboard.dismiss()
                                op_name.value = withSpring(0, { duration: 300 })
                            }}>
                                <Text className="font-[ebold] text-xl text-gray-700 mt-3">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setName(nameTemp)
                                Keyboard.dismiss()
                                op_name.value = withSpring(0, { duration: 300 })
                            }}>
                                <Text className="font-[ebold] text-xl text-blue-600 mt-3">Save</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Animated.View>


                <TouchableOpacity onPress={() => {
                    anim_opa.value = withSpring(anim_opa.value === 0 ? 1 : 0, { duration: 300 })


                }} className="absolute right-5 top-13 z-10">
                    <Image style={{ tintColor: 'white', width: 35, height: 35 }} source={require('../../../assets/images/more.png')}></Image>
                </TouchableOpacity>

                <Animated.View style={{ opacity: anim_opa }} className="w-[100px]  bg-white flex items-center rounded-2xl shadow absolute right-5 top-24 border border-gray-200 z-1">
                    <TouchableOpacity className="py-3 w-full flex justify-center items-center">
                        <Text className="font-[ebold] text-gray-700">Favorite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert("Are you sure you want to delete this item?", "This action cannot be undone.", [
                            {
                                text: 'Cancel',
                            },
                            {
                                text: 'Delete',
                                style: "destructive",
                                onPress: async () => {
                                    let f = new Food()
                                    let res: any = await f.deleteFood(Number(id))

                                    console.log(res)

                                    if (res == "Deleted") {
                                        router.replace("/home")
                                    }
                                }
                            }
                        ])
                    }} className="py-3 w-full flex justify-center items-center">
                        <Text className="font-[ebold] text-red-600">Delete</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Image style={{ width: '100%', height: 150 }} source={{ uri: `${public_url}/foods/${select?.img}` }}></Image>
                <View className="p-5">
                    <View className="flex flex-row justify-between">
                        <Text className="font-[medium] text-2xl" style={{ lineHeight: 30 }}>{name ? name : select?.name}</Text>
                        <TouchableOpacity onPress={() => {
                            op_name.value = withSpring(1, { duration: 300 })
                        }}>
                            <Icon name="pencil-sharp" size={24} color="#4B5563"></Icon>
                        </TouchableOpacity>
                    </View>

                    <View className="w-full px-6 py-4 flex flex-row justify-between items-center border border-gray-300 rounded-2xl mt-3">
                        <View className="flex flex-row items-center gap-2">
                            <Icon name="nutrition-outline" size={24} color="#4B5563"></Icon>
                            <Text className="font-[ebold] text-xl text-gray-700">Portion</Text>
                        </View>
                        <TextInput keyboardType="number-pad" onFocus={() => {
                            setPortion('')
                        }} onChangeText={(e) => {

                            setPortion(e)
                        }} textAlign="center" value={String(portion)} className="font-[ebold] w-[60px] text-xl text-gray-700 border-b-1 border-gray-300 p-2 rounded-2xl"></TextInput>
                    </View>

                    <View className="w-full px-6 py-4 flex flex-row justify-between items-center border border-gray-300 rounded-2xl mt-3">
                        <View className="flex flex-row items-center gap-2">
                            <Image style={{ width: 24, height: 24 }} source={require('../../../assets/images/fire.png')}></Image>
                            <Text className="font-[ebold] text-xl text-gray-700">Kcal</Text>
                        </View>
                        <TextInput keyboardType="number-pad" onFocus={() => {
                            setKcal('')
                        }} onChangeText={(e) => {

                            setKcal(e)
                        }} textAlign="center" value={String(kcal)} className="font-[ebold] w-[60px] text-xl text-gray-700 border-b-1 border-gray-300 p-2 rounded-2xl"></TextInput>
                    </View>

                    <View className="w-full flex flex-row gap-3 mt-3">
                        {/* Protein */}
                        <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                            <Text className="font-[ebold] text-sm text-gray-500">Protein</Text>
                            <TextInput keyboardType="number-pad" onFocus={() => {
                                setProtein('')
                            }} onChangeText={(e) => {

                                setProtein(e)
                            }} textAlign="center" value={String(protein)} className="font-[ebold] mt-1 w-[60px] text-xl text-gray-700 border-b-1 border-gray-300 p-2 rounded-2xl"></TextInput>
                        </View>

                        {/* Carbs */}
                        <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                            <Text className="font-[ebold] text-sm text-gray-500">Carbs</Text>
                            <TextInput keyboardType="number-pad" onFocus={() => {
                                setCarbs('')
                            }} onChangeText={(e) => {

                                setCarbs(e)
                            }} textAlign="center" value={String(carbs)} className="font-[ebold] mt-1 w-[60px] text-xl text-gray-700 border-b-1 border-gray-300 p-2 rounded-2xl"></TextInput>
                        </View>

                        {/* Fat */}
                        <View className="flex-1 px-4 py-4 flex flex-col items-center border border-gray-300 rounded-2xl">
                            <Text className="font-[ebold] text-sm text-gray-500">Fat</Text>
                            <TextInput keyboardType="number-pad" onFocus={() => {
                                setFat('')
                            }} onChangeText={(e) => {

                                setFat(e)
                            }} textAlign="center" value={String(fat)} className="font-[ebold] mt-1 w-[60px] text-xl text-gray-700 border-b-1 border-gray-300 p-2 rounded-2xl"></TextInput>
                        </View>


                    </View>

                </View>
                <View className="w-full items-center flex-1">
                    <TouchableOpacity
                        onPress={async () => {
                            let f = new Food()

                            let res = await f.updateFood(Number(id), name, Number(portion), Number(kcal), Number(protein), Number(carbs), Number(fat))

                            if (res.data) {
                                router.replace("/home")
                            }
                        }}

                        activeOpacity={0.85}
                        className="w-[80%] rounded-2xl py-3 items-center justify-center bg-green-600/10 border-green-600 border absolute bottom-40"
                    >
                        <Text className="text-green-600 font-[ebold] text-base text-[20px] tracking-wide">
                            Save Data
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            router.back()
                        }}
                        activeOpacity={0.85}
                        className="w-[80%] rounded-2xl py-3 items-center justify-center bg-orange-600/10 border-orange-600 border absolute bottom-20"
                    >
                        <Text className="text-orange-600 font-[ebold] text-base text-[20px] tracking-wide">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Product