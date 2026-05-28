import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"
import { Excercise } from "@/class/excercise.class"

const Exercise = () => {
    const INTENSITY = ["chill", "normal", "tired"]

    const [intensity, setIntensity] = useState("normal")


    const [form, setForm] = useState<any>({
        activity: "",
        duration: 0,
    })

    let { id } = useLocalSearchParams()

    const fields = [
        { key: "activity", label: "Activity", placeholder: "ex. running in the park", keyboardType: "default" },
        { key: "duration", label: "Duration (minutes)", placeholder: "30", keyboardType: "numeric" },
    ]

    console.log("man : ", id)

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-20">
            <View className="flex flex-row gap-2 mb-5">
                <Back></Back>
                <Text className="font-[ebold] text-xl">Manually Add Food</Text>
            </View>

            {fields.map((field: any, index) => (
                <View key={field.key} className="mb-4">
                    <Text className="text-lg text-gray-600 mb-1 font-[ebold]">
                        {field.label}
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-xl font-[emedium] px-4 py-3 text-base text-gray-800 bg-gray-50"
                        placeholder={field.placeholder}
                        placeholderTextColor="#9CA3AF"
                        keyboardType={field.keyboardType}
                        value={form[field.key]}
                        onChangeText={(text) =>
                            setForm((prev: any) => ({ ...prev, [field.key]: text }))
                        }
                    />
                </View>
            ))}

            {/* Intensity Toggle */}
            <View className="flex-row gap-2">
                {INTENSITY.map((level) => (
                    <TouchableOpacity
                        key={level}
                        onPress={() => setIntensity(level)}
                        className={`flex-1 py-3 rounded-xl items-center border ${intensity === level
                            ? "bg-purple-500 border-purple-500"
                            : "bg-gray-50 border-gray-200"
                            }`}
                    >
                        <Text className={`font-[ebold] text-sm ${intensity === level ? "text-white" : "text-gray-500"
                            }`}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                    if (form.activity && form.duration && intensity) {
                        let e = new Excercise()

                        console.log("Adding exercise with: ", form.activity, form.duration, intensity, id)
                        let res = await e.addEx(form.activity, form.duration, intensity, Number(id))

                        if (res.statusCode === 201) {
                            router.replace('/home')
                        }
                    } else {
                        Alert.alert("ข้อมูลไม่ครบถ้วน")
                    }
                }}
                className="mt-4 mb-10">
                <Text
                    className="bg-green-500 text-white text-center py-4 rounded-xl text-xl font-[ebold] overflow-hidden"

                >
                    Save
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Exercise