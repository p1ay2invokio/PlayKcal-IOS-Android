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

const Exm = () => {
    const { t } = useLanguageStore()
    let { id, activity, caloriesBurned } = useLocalSearchParams()
    
    const [form, setForm] = useState<any>({
        activity: activity ? String(activity) : "",
        caloriesBurned: caloriesBurned ? String(caloriesBurned) : ""
    })

    const fields = [
        { key: "activity", label: t('activityLabel'), placeholder: t('activityPlaceholder'), keyboardType: "default" },
        { key: "caloriesBurned", label: t('caloriesBurned'), placeholder: "ex. 300", keyboardType: "numeric" },
    ]

    return (
        <ScrollView
            className="flex-1 bg-[#F8FAF7]"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="bg-white px-5 pb-5 shadow-sm" style={{ paddingTop: 56 }}>
                <View className="flex-row items-center gap-3">
                    <Back />
                    <Text className="font-[ebold] text-2xl text-gray-900">
                        {t('addExercise')}
                    </Text>
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
                                keyboardType={field.keyboardType}
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
                            let res = await e.addExManual(form.activity, Number(form.caloriesBurned), Number(id))
                            console.log(res)
                            if (res.statusCode === 201) {
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
                        {t('saveExercise')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Exm