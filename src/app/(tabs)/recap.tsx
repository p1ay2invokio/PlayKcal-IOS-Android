import { Stat } from "@/class/stat.class";
import { User } from "@/class/user.class";
import BMITimeline from "@/components/bmi";
import Pie from "@/components/pie";
import { useCurrentPickDate } from "@/stores/date.store";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    Keyboard,
    Dimensions,
} from "react-native";
import { BarChart } from 'react-native-gifted-charts'

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 70; // ความกว้างของกรอบที่มองเห็น (Viewport)


const Recap = () => {


    let [barData, setBarData] = useState<any>([])

    let [currentWeight, setCurrentWeight] = useState("")



    let [modal, setModal] = useState(false)


    useEffect(() => {

        (async () => {
            let s = new Stat()

            let res = await s.getStat(7)

            setBarData(res)
        })()

        // setBarData(barData)
    }, [])

    return (
        <View className="flex-1">


            {/* {modal ? <Pressable onPress={()=>{
                setModal(false)
            }} className='bg-[#000]/40 w-full h-full z-1 absolute top-0 left-0 flex justify-center items-center'>
                <View className="w-[70%] bg-white p-5 py-10 rounded-2xl">
                    <TextInput textAlign="center" className="font-[ebold] text-2xl border-b-1 border-gray-300" value={currentWeight} keyboardType="numeric" onChangeText={(text) => {
                        const clean = text.replace(/[^0-9]/g, '')
                        if (clean === '') {
                            setCurrentWeight('')
                            return
                        }
                        if (clean.startsWith('0')) return
                        setCurrentWeight(clean)
                    }} placeholder="60" />
                    <TouchableOpacity onPress={async () => {
                        if (currentWeight) {
                            const user = new User()
                            let date = new Date()
                            let convertDay = dayjs(date).format("DD-MM-YYYY")
                            const result = await user.updateWeight(Number(currentWeight), convertDay)

                            if (result.statusCode === 200) {
                                setModal(false)
                                setCurrentWeight("")
                                Keyboard.dismiss()
                                router.push('/home')
                            }
                        }else{
                            Alert.alert("Error", "Please enter a valid weight")
                        }
                    }} className="bg-green-500 font-[ebold] border-b-1 border-gray-300 py-3 rounded-xl mt-4 flex justify-center items-center">
                        <Text className="text-white font-[ebold] text-xl">Update</Text>
                    </TouchableOpacity>
                </View>
            </Pressable> : null} */}

            <ScrollView
                className="flex-1 p-5 px-5 pt-5 gap-3 bg-white">

                <View className="border border-gray-200 rounded-3xl shadow-gray-200 shadow-sm p-3">
                    <BMITimeline></BMITimeline>
                    {/* <TouchableOpacity onPress={() => setModal(true)} activeOpacity={0.7} className='flex-1 bg-green-600 py-3 rounded-xl flex justify-center items-center mb-3'>
                        <Text className='text-white font-[ebold]'>Update Current Weight</Text>
                    </TouchableOpacity> */}
                </View>



                <View className="bg-white p-5 rounded-3xl mt-4 border border-gray-100 shadow-sm shadow-gray-200 overflow-hidden">

                    {/* Header Section */}
                    <View className="mb-6">
                        <Text className="font-[ebold] text-2xl text-gray-800">
                            Calories Burned
                        </Text>
                        <Text className="font-[emedium] text-sm text-gray-400 mt-1">
                            Last 7 days of total calories
                        </Text>
                    </View>

                    <BarChart
                        data={barData}
                        width={chartWidth}
                        barWidth={28} // ปรับให้แท่งหนาขึ้นเล็กน้อย
                        spacing={35} // ระยะห่างระหว่างแท่ง
                        barBorderRadius={6} // มุมโค้งมนขึ้น

                        // การตั้งค่าสีและ Gradient (ช่วยให้กราฟดูมีมิติ)
                        frontColor="#8b5cf6"
                        showGradient
                        gradientColor="#c4b5fd"

                        // ซ่อนแกนเส้นทึบ แต่แสดงเส้นกริดจางๆ ด้านหลัง
                        yAxisThickness={0}
                        xAxisThickness={0}
                        hideRules={false}
                        rulesType="solid"
                        rulesColor="#f3f4f6"

                        // ปรับแต่งฟอนต์และสีของตัวเลขบนแกน
                        xAxisLabelTextStyle={{ fontFamily: 'emedium', color: '#9ca3af', fontSize: 12 }}
                        yAxisTextStyle={{ fontFamily: 'emedium', color: '#9ca3af', fontSize: 12 }}

                        // Tooltip ที่ดูสวยงามและชัดเจนขึ้น
                        renderTooltip={(item: any) => (
                            <View style={{
                                backgroundColor: '#1f2937', // สีพื้นหลังเข้มเพื่อให้ข้อความเด่น
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 8,
                                marginBottom: 8,
                                // เพิ่มเงาให้ Tooltip
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.15,
                                shadowRadius: 4,
                                elevation: 3,
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                    fontFamily: 'ebold',
                                    textAlign: 'center'
                                }}>
                                    {item.value}
                                </Text>
                                <Text style={{
                                    color: '#9ca3af',
                                    fontSize: 10,
                                    fontFamily: 'emedium',
                                    textAlign: 'center'
                                }}>
                                    kcal
                                </Text>
                            </View>
                        )}

                        initialSpacing={10}
                        disableScroll={false}
                        scrollToEnd={true}
                        horizontal={false}
                        minHeight={5}
                        noOfSections={5} // ลดจำนวน Section ลงเพื่อให้เส้นกริดไม่ดูรกเกินไป
                        stepValue={1200}
                        maxValue={6000}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default Recap