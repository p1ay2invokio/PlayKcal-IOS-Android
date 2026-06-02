import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
        { key: "name", label: "Name", placeholder: "ex. fried rice", keyboardType: "default" },
        { key: "qty", label: "Portion", placeholder: "1", keyboardType: "numeric" },
        { key: "kcal", label: "Calories (kcal)", placeholder: "250", keyboardType: "numeric" },
    ]

    const macroFields = [
        { key: "protein", label: "Protein (g)", placeholder: "10", keyboardType: "numeric" },
        { key: "carbs", label: "Carbs (g)", placeholder: "30", keyboardType: "numeric" },
        { key: "fat", label: "Fat (g)", placeholder: "8", keyboardType: "numeric" },
    ]

    const macroColors = ['#4ADE80', '#60A5FA', '#F97316']
    const macroBgColors = ['#F0FDF4', '#EFF6FF', '#FFF7ED']

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
                        Add Food
                    </Text>
                </View>
            </View>

            <View className="px-5 pt-6">
                {/* Main fields */}
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-4 gap-4">
                    <Text className="font-[ebold] text-xs text-green-600 uppercase">
                        Food Details
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

                {/* Macros section */}
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                    <Text className="font-[ebold] text-xs text-green-600 uppercase" style={{ marginBottom: 16 }}>
                        Macronutrients
                    </Text>
                    <View className="flex-row gap-3">
                        {macroFields.map((field: any, index: number) => (
                            <View key={field.key} className="flex-1">
                                <View
                                    className="h-1 rounded-full"
                                    style={{ backgroundColor: macroColors[index], marginBottom: 8 }}
                                />
                                <Text
                                    className="text-xs font-[ebold] text-gray-500"
                                    style={{ marginBottom: 6 }}
                                >
                                    {field.label}
                                </Text>
                                <TextInput
                                    style={{
                                        backgroundColor: macroBgColors[index],
                                        paddingVertical: 12,
                                        paddingHorizontal: 12,
                                        borderRadius: 12,
                                        fontSize: 14,
                                        color: '#1F2937',
                                        textAlign: 'center',
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
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={async () => {
                        if (form.name && form.carbs && form.fat && form.kcal && form.protein && form.qty && id) {
                            let f = new Food();
                            let res = await f.manualAddFood(form, id);
                            if (res.statusCode === 201) {
                                router.replace('/home');
                            }
                        } else {
                            Alert.alert("ข้อมูลไม่ครบถ้วน");
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
                    <Text className="text-white font-[ebold] text-lg">
                        Save Food
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Manual