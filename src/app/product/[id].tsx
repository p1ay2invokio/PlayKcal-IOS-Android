import { Food } from "@/class/food.class"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { public_url } from "../../../config"
import Icon from "@expo/vector-icons/Ionicons"
import Animated, { useSharedValue, withSpring } from "react-native-reanimated"
import { useLanguageStore } from "@/stores/language.store"
import cookie from '@react-native-async-storage/async-storage'

const Product = () => {
    let { id } = useLocalSearchParams()
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
    const { t } = useLanguageStore()

    const toggleFavorite = async () => {
        try {
            anim_opa.value = 0
            const favsStr = await cookie.getItem("favorite_foods")
            let favs = favsStr ? JSON.parse(favsStr) : []
            
            const currentName = name || select?.name
            const isFav = favs.some((item: any) => item.name === currentName)
            
            if (isFav) {
                favs = favs.filter((item: any) => item.name !== currentName)
                await cookie.setItem("favorite_foods", JSON.stringify(favs))
                Alert.alert(t('success'), t('removedFromFav'))
            } else {
                const newItem = {
                    name: currentName,
                    calories: kcal || select?.calories,
                    protein: protein || select?.protein,
                    carbs: carbs || select?.carbs,
                    fat: fat || select?.fat,
                    quantity: portion || select?.quantity
                }
                favs.push(newItem)
                await cookie.setItem("favorite_foods", JSON.stringify(favs))
                Alert.alert(t('success'), t('savedToFav'))
            }
        } catch (e) {
            console.error("Error toggling favorite:", e)
        }
    }

    useEffect(() => {
        (async () => {
            let f = new Food()
            let foodItem = await f.getFoodById(Number(id))
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

                {/* Modal เปลี่ยนชื่ออาหาร */}
                <Animated.View
                    style={{ opacity: op_name }}
                    className="w-full h-full absolute top-0 left-0 bg-black/60 z-50 flex justify-center items-center px-6"
                >
                    <View className="w-full bg-white rounded-3xl p-6 shadow-lg">
                        <Text className="font-[ebold] text-xl text-gray-800 mb-4 text-center">{t('editFoodName')}</Text>

                        <TextInput
                            textAlign="center"
                            value={nameTemp}
                            onChangeText={setNameTemp}
                            style={{ includeFontPadding: false }}
                            className="w-full font-[medium] text-xl py-3 bg-gray-50 border-gray-200 border rounded-xl mb-5"
                        />

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                                onPress={() => {
                                    Keyboard.dismiss()
                                    op_name.value = withSpring(0, { duration: 300 })
                                }}
                            >
                                <Text className="font-[ebold] text-lg text-gray-600">{t('cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-blue-600 py-3 rounded-xl items-center shadow-sm shadow-blue-300"
                                onPress={() => {
                                    setName(nameTemp)
                                    Keyboard.dismiss()
                                    op_name.value = withSpring(0, { duration: 300 })
                                }}
                            >
                                <Text className="font-[ebold] text-lg text-white">{t('save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* เมนู 3 จุด มุมขวาบน */}
                <TouchableOpacity
                    onPress={() => {
                        anim_opa.value = withSpring(anim_opa.value === 0 ? 1 : 0, { duration: 300 })
                    }}
                    className="absolute right-5 top-12 z-20 bg-black/20 p-2 rounded-full"
                >
                    <Image style={{ tintColor: 'white', width: 24, height: 24 }} source={require('../../../assets/images/more.png')} />
                </TouchableOpacity>

                <Animated.View
                    style={{ opacity: anim_opa }}
                    className="w-[120px] bg-white rounded-2xl shadow-md absolute right-5 top-24 z-10"
                >
                    <TouchableOpacity onPress={toggleFavorite} className="py-4 w-full flex justify-center items-center border-b border-gray-100">
                        <Text className="font-[ebold] text-gray-700">{t('favorite')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        anim_opa.value = withSpring(anim_opa.value === 0 ? 1 : 0, { duration: 300 })
                        Alert.alert(t('confirmDelete'), t('deleteFoodConfirmMsg'), [
                            { text: t('cancel') },
                            {
                                text: t('delete'),
                                style: "destructive",
                                onPress: async () => {
                                    let f = new Food()
                                    let res: any = await f.deleteFood(Number(id))
                                    if (res == "Deleted") {
                                        router.replace("/home")
                                    }
                                }
                            }
                        ])
                    }} className="py-4 w-full flex justify-center items-center">
                        <Text className="font-[ebold] text-red-500">{t('delete')}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* รูปภาพ Header */}
                <View className="relative">
                    {select?.img ? (
                        <Image style={{ width: '100%', height: 220 }} source={{ uri: `${public_url}/foods/${select.img}` }} />
                    ) : (
                        <Image style={{ width: '100%', height: 220, zIndex: -1 }} source={require("../../../assets/images/eat.png")} />
                    )}
                    {/* เงาด้านบนเพื่อให้เห็นเมนู 3 จุดชัดเจนขึ้น */}
                    <View className="absolute top-0 w-full h-24 bg-black/10" />
                </View>

                {/* ส่วนเนื้อหาหลัก (ดึงขึ้นมาซ้อนทับภาพด้วย -mt-6) */}
                <View className="flex-1 bg-white rounded-t-[30px] -mt-6 px-6 pt-6 shadow-sm">

                    {/* ชื่ออาหาร & ปุ่มแก้ไข */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-[ebold] text-2xl text-gray-800 flex-1" numberOfLines={2}>
                            {name ? name : select?.name}
                        </Text>
                        <TouchableOpacity
                            className="p-2 bg-gray-100 rounded-full ml-3"
                            onPress={() => op_name.value = withSpring(1, { duration: 300 })}
                        >
                            <Icon name="pencil-sharp" size={20} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    {/* ส่วน Portion & Kcal */}
                    <View className="gap-3">
                        <View className="w-full px-5 py-4 flex-row justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl">
                            <View className="flex-row items-center gap-3">
                                <Icon name="nutrition-outline" size={22} color="#4B5563" />
                                <Text className="font-[ebold] text-lg text-gray-700">{t('portion')}</Text>
                            </View>
                            <TextInput
                                keyboardType="number-pad"
                                onFocus={() => setPortion('')}
                                onChangeText={setPortion}
                                textAlign="right"
                                value={String(portion)}
                                className="font-[ebold] text-xl text-blue-600 min-w-[60px]"
                            />
                        </View>

                        <View className="w-full px-5 py-4 flex-row justify-between items-center bg-orange-50 border border-orange-100 rounded-2xl">
                            <View className="flex-row items-center gap-3">
                                <Image style={{ width: 22, height: 22 }} source={require('../../../assets/images/fire.png')} />
                                <Text className="font-[ebold] text-lg text-orange-700">{t('kcalLabel')}</Text>
                            </View>
                            <TextInput
                                keyboardType="number-pad"
                                onFocus={() => setKcal('')}
                                onChangeText={setKcal}
                                textAlign="right"
                                value={String(kcal)}
                                className="font-[ebold] text-xl text-orange-600 min-w-[60px]"
                            />
                        </View>
                    </View>

                    {/* ส่วน Macros (Protein, Carbs, Fat) */}
                    <View className="flex-row gap-3 mt-3">
                        <View className="flex-1 py-4 items-center bg-gray-50 border border-gray-100 rounded-2xl">
                            <Text className="font-[ebold] text-xs text-gray-500 uppercase tracking-wider mb-1">{t('protein')}</Text>
                            <TextInput
                                keyboardType="number-pad"
                                onFocus={() => setProtein('')}
                                onChangeText={setProtein}
                                textAlign="center"
                                value={String(protein)}
                                className="font-[ebold] text-xl text-gray-800 w-full"
                            />
                        </View>

                        <View className="flex-1 py-4 items-center bg-gray-50 border border-gray-100 rounded-2xl">
                            <Text className="font-[ebold] text-xs text-gray-500 uppercase tracking-wider mb-1">{t('carbs')}</Text>
                            <TextInput
                                keyboardType="number-pad"
                                onFocus={() => setCarbs('')}
                                onChangeText={setCarbs}
                                textAlign="center"
                                value={String(carbs)}
                                className="font-[ebold] text-xl text-gray-800 w-full"
                            />
                        </View>

                        <View className="flex-1 py-4 items-center bg-gray-50 border border-gray-100 rounded-2xl">
                            <Text className="font-[ebold] text-xs text-gray-500 uppercase tracking-wider mb-1">{t('fat')}</Text>
                            <TextInput
                                keyboardType="number-pad"
                                onFocus={() => setFat('')}
                                onChangeText={setFat}
                                textAlign="center"
                                value={String(fat)}
                                className="font-[ebold] text-xl text-gray-800 w-full"
                            />
                        </View>
                    </View>

                    {/* กลุ่มปุ่มอัปเดตและยกเลิก (ดันลงล่างอัตโนมัติด้วย mt-auto) */}
                    <View className="mt-auto mb-10 gap-3">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={async () => {
                                let f = new Food()
                                let res = await f.updateFood(Number(id), name, Number(portion), Number(kcal), Number(protein), Number(carbs), Number(fat))
                                if (res.data) {
                                    router.replace("/home")
                                }
                            }}
                            className="w-full rounded-2xl py-4 items-center justify-center bg-green-600 shadow-sm shadow-green-300"
                        >
                            <Text className="text-white font-[ebold] text-lg tracking-wide">
                                {t('updateFood')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            className="w-full rounded-2xl py-4 items-center justify-center bg-gray-100"
                        >
                            <Text className="text-gray-600 font-[ebold] text-lg tracking-wide">
                                {t('cancel')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Product