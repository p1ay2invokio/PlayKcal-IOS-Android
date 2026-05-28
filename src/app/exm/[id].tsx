import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { act, useEffect, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"
import { Excercise } from "@/class/excercise.class"
import Exercise from "../exercise"
//@ts-ignore
import Icon from "react-native-vector-icons/Ionicons"

const Exm = () => {


    const [form, setForm] = useState<any>({
        activity: "",
        caloriesBurned: 0
    })

    let { id } = useLocalSearchParams()

    const fields = [
        { key: "activity", label: "Activity", placeholder: "ex. running in the park", keyboardType: "default" },
        { key: "caloriesBurned", label: "Calories Burned", placeholder: "ex. 300", keyboardType: "numeric" },
    ]

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-20">
            <View className="flex flex-row gap-2 mb-5">
                <Back></Back>
                <Text className="font-[ebold] text-xl">Add Manually Exercise</Text>
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
                        value={form[field.key]}
                        onChangeText={(text) =>
                            setForm((prev: any) => ({ ...prev, [field.key]: text }))
                        }
                    />
                </View>
            ))}

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                    if (form.activity && form.caloriesBurned) {
                        let e = new Excercise()


                        let res = await e.addExManual(form.activity, Number(form.caloriesBurned), Number(id))

                        console.log(res)
                        if (res.statusCode === 200) {
                            router.replace("/home")
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

export default Exm