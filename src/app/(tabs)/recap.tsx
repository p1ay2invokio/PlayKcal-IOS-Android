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
} from "react-native";
import { BarChart } from 'react-native-gifted-charts'


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

                <View className="border border-gray-200 rounded-2xl p-3">
                    <BMITimeline></BMITimeline>
                    {/* <TouchableOpacity onPress={() => setModal(true)} activeOpacity={0.7} className='flex-1 bg-green-600 py-3 rounded-xl flex justify-center items-center mb-3'>
                        <Text className='text-white font-[ebold]'>Update Current Weight</Text>
                    </TouchableOpacity> */}
                </View>



                <View className="bg-white p-3 rounded-2xl mt-4 border border-gray-200">

                    <Text className="text-center mb-3 font-[ebold] text-xl text-gray-500">7 Days of total calories</Text>

                    <BarChart
                        barWidth={20}
                        barBorderRadius={4}
                        frontColor="#8b5cf6"
                        barStyle={{ fontFamily: 'emedium' }}
                        data={barData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        xAxisLabelTextStyle={{ fontFamily: 'emedium' }}
                        yAxisTextStyle={{ fontFamily: 'emedium' }}
                        renderTooltip={(item: any) => (
                            <View style={{
                                backgroundColor: '#8b5cf6',
                                paddingHorizontal: 4,
                                paddingVertical: 2,
                                borderRadius: 4,
                                marginBottom: 4,
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 10,
                                    fontFamily: 'emedium',
                                }}>
                                    {item.value}
                                </Text>
                            </View>
                        )}
                        disableScroll={true}
                        horizontal={false}
                        width={400}
                        hideRules={true}
                        minHeight={5}
                        noOfSections={6}
                        stepValue={1200}
                        maxValue={6000}
                    />
                </View>

                {/* <View className="mt-3 flex flex-row gap-2">
                <Pie></Pie>
                <View className="flex-1 border border-gray-200 rounded-2xl p-3">
                    <Text>Hello</Text>
                </View>
            </View> */}
            </ScrollView>
        </View>
    )
}

export default Recap