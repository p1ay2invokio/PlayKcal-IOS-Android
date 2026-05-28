import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { act, useEffect, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import Back from "@/components/back"
import { Food } from "@/class/food.class"
import { Excercise } from "@/class/excercise.class"
import Exercise from "../exercise"
//@ts-ignore
import Icon from "react-native-vector-icons/Ionicons"

const Ex = () => {


    const [form, setForm] = useState<any>({
        activity: "",
        caloriesBurned: 0
    })

    let { id } = useLocalSearchParams()

    const fields = [
        { key: "activity", label: "Activity", placeholder: "เช่น วิ่งในสวน, เล่นบาส", keyboardType: "default" },
        { key: "caloriesBurned", label: "Calories Burned", placeholder: "เช่น 300", keyboardType: "numeric" },
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
        <ScrollView className="flex-1 bg-white px-5 pt-20">
            <View className="flex flex-row gap-2 mb-5 justify-between">
                <Back></Back>
                <Text className="font-[ebold] text-xl">Edit Activity</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    Alert.alert("ยืนยันการลบ", "คุณต้องการลบกิจกรรมนี้หรือไม่?", [
                        {
                            text: "ยกเลิก",
                            style: "cancel"
                        },
                        {
                            text: "ลบ",
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
                }}>
                    <Icon name="trash" size={24} color="red" />
                </TouchableOpacity>
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


                        let res = await e.updateEx(Number(id), form.activity, form.caloriesBurned)

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
                    บันทึก
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Ex