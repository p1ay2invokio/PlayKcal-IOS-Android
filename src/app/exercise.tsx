import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"
import { Excercise } from "@/class/excercise.class"
import Loading from "@/components/loading"
import { useLanguageStore } from "@/stores/language.store"

const Exercise = () => {
    const INTENSITY = ["chill", "normal", "tired"]
    const [intensity, setIntensity] = useState("normal")
    const [form, setForm] = useState<any>({
        activity: "",
        duration: 0,
    })
    let [loading, setLoading] = useState(false)
    let { id } = useLocalSearchParams()
    const { t } = useLanguageStore()

    const fields = [
        { key: "activity", label: t('activityLabel'), placeholder: t('activityPlaceholder'), keyboardType: "default" },
        { key: "duration", label: t('durationLabel'), placeholder: t('durationPlaceholder'), keyboardType: "numeric" },
    ]

    console.log("man : ", id)

    return (
        <View className="flex-1">
            {loading ? <Loading></Loading> : null}

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
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-4 gap-4">
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

                    {/* Intensity Card */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <Text className="font-[ebold] text-xs text-green-600 uppercase" style={{ marginBottom: 14 }}>
                            {t('intensityLabel')}
                        </Text>
                        <View className="flex-row gap-2">
                            {INTENSITY.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setIntensity(level)}
                                    className="flex-1 rounded-xl items-center"
                                    style={{
                                        paddingVertical: 12,
                                        backgroundColor: intensity === level ? '#A855F7' : '#F9FAFB',
                                        borderWidth: 1,
                                        borderColor: intensity === level ? '#A855F7' : '#F3F4F6',
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'ebold',
                                        fontSize: 13,
                                        color: intensity === level ? '#FFFFFF' : '#6B7280',
                                    }}>
                                        {t(level as any)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={async () => {
                            if (form.activity && form.duration && intensity) {
                                setLoading(true)
                                let e = new Excercise()
                                let res = await e.addEx(form.activity, form.duration, intensity, Number(id))

                                if (res.statusCode === 201) {
                                    setLoading(false)
                                    router.replace('/home')
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
        </View>
    )
}

export default Exercise