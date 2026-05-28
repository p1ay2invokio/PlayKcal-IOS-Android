import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"

const Manual = () => {
    const [form, setForm] = useState<any>({
        name: "",
        qty: "",
        kcal: "",
        protein: "",
        carbs: "",
        fat: "",
    })

    let { id } = useLocalSearchParams()

    const fields = [
        { key: "name", label: "name", placeholder: "ex. fried rice", keyboardType: "default" },
        { key: "qty", label: "portion", placeholder: "1", keyboardType: "numeric" },
        { key: "kcal", label: "Calories (kcal)", placeholder: "250", keyboardType: "numeric" },
    ]

    const macroFields = [
        { key: "protein", label: "Protein (g)", placeholder: "10", keyboardType: "numeric" },
        { key: "carbs", label: "Carbs (g)", placeholder: "30", keyboardType: "numeric" },
        { key: "fat", label: "Fat (g)", placeholder: "8", keyboardType: "numeric" },
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


            {/* Protein, Carbs, Fat - flex row */}
            <View className="flex-row gap-3 mb-4">
                {macroFields.map((field: any) => (
                    <View key={field.key} className="flex-1">
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
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                    if (form.name && form.carbs && form.fat && form.name && form.kcal && form.protein && form.qty && id) {
                        let f = new Food()

                        let res = await f.manualAddFood(form, id)

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

export default Manual