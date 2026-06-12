import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { act, useEffect, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"
import { Excercise } from "@/class/excercise.class"
import Exercise from "../exercise"
//@ts-ignore
import Icon from "react-native-vector-icons/Ionicons"
import { useLanguageStore } from "@/stores/language.store"
import cookie from '@react-native-async-storage/async-storage'

const Ex = () => {
    const { t } = useLanguageStore()
    const [form, setForm] = useState<any>({
        activity: "",
        caloriesBurned: 0
    })

    let { id } = useLocalSearchParams()

    const toggleFavorite = async () => {
        try {
            const favsStr = await cookie.getItem("favorite_exercises")
            let favs = favsStr ? JSON.parse(favsStr) : []
            
            const currentActivity = form.activity
            const isFav = favs.some((item: any) => item.activity === currentActivity)
            
            if (isFav) {
                favs = favs.filter((item: any) => item.activity !== currentActivity)
                await cookie.setItem("favorite_exercises", JSON.stringify(favs))
                Alert.alert(t('success'), t('removedFromFav'))
            } else {
                const newItem = {
                    activity: currentActivity,
                    caloriesBurned: form.caloriesBurned
                }
                favs.push(newItem)
                await cookie.setItem("favorite_exercises", JSON.stringify(favs))
                Alert.alert(t('success'), t('savedToFav'))
            }
        } catch (e) {
            console.error("Error toggling favorite exercise:", e)
        }
    }

    const fields = [
        { key: "activity", label: t('activityLabel'), placeholder: t('activityPlaceholder'), keyboardType: "default" },
        { key: "caloriesBurned", label: t('caloriesBurned'), placeholder: "เช่น 300", keyboardType: "numeric" },
    ]

    useEffect(() => {
        (async () => {
            let e = new Excercise()
            let data = await e.getEx(Number(id))
            setForm({
                activity: data.name,
                caloriesBurned: String(data.caloriesBurned)
            })
            console.log(form)
        })()
    }, [])

    console.log("man : ", id)

    return (
        <ScrollView
            className="flex-1 bg-[#F8FAF7]"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="bg-white px-5 pb-5 shadow-sm" style={{ paddingTop: 56 }}>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <Back />
                        <Text className="font-[ebold] text-2xl text-gray-900">
                            {t('editActivity')}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        {/* Favorite button */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="bg-amber-50 rounded-xl"
                            style={{ padding: 10 }}
                            onPress={toggleFavorite}
                        >
                            <Icon name="star" size={20} color="#D97706" />
                        </TouchableOpacity>

                        {/* Delete button */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="bg-red-50 rounded-xl"
                            style={{ padding: 10 }}
                            onPress={() => {
                                Alert.alert(t('confirmDelete'), t('deleteExerciseConfirmMsg'), [
                                    { text: t('cancel'), style: "cancel" },
                                    {
                                        text: t('delete'),
                                        style: "destructive",
                                        onPress: async () => {
                                            let e = new Excercise()
                                            let res = await e.deleteEx(Number(id))
                                            if (res.statusCode === 200) {
                                                router.replace("/home")
                                            }
                                        }
                                    }
                                ])
                            }}
                        >
                            <Icon name="trash" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="px-5 pt-6">
                {/* Fields Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 gap-4">
                    <Text className="font-[ebold] text-xs text-green-600 uppercase">
                        {t('exerciseDetails')}
                    </Text>
                    {fields.map((field: any) => (
                        <View key={field.key}>
                            <Text
                                className="text-sm font-[ebold] text-gray-500"
                                style={{ marginBottom: 6 }}
                            >
                                {field.label}
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#F9FAFB',
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6',
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    color: '#1F2937',
                                    fontFamily: 'emedium',
                                }}
                                placeholder={field.placeholder}
                                placeholderTextColor="#C4C9C2"
                                value={form[field.key]}
                                onChangeText={(text) =>
                                    setForm((prev: any) => ({ ...prev, [field.key]: text }))
                                }
                            />
                        </View>
                    ))}
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={async () => {
                        if (form.activity && form.caloriesBurned) {
                            let e = new Excercise()
                            let res = await e.updateEx(Number(id), form.activity, form.caloriesBurned)
                            console.log(res)
                            if (res.statusCode === 200) {
                                router.replace("/home")
                            }
                        } else {
                            Alert.alert(t('incompleteData'))
                        }
                    }}
                    className="bg-green-500 rounded-2xl items-center"
                    style={{
                        paddingVertical: 16,
                        shadowColor: '#22c55e',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                    }}
                >
                    <Text style={{ color: 'white', fontFamily: 'ebold', fontSize: 18 }}>
                        {t('save')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Ex