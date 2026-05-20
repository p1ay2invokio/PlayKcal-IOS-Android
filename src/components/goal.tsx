import { useMeasureStore } from "@/stores/measure.store"
import { Text, TouchableOpacity, View } from "react-native"

const Goal = () => {

    let { nextPage, setGoal } = useMeasureStore()


    return (
        <View className="flex-1 justify-start pt-20 items-center bg-white">
            <Text className="mb-10 font-[ebold] text-3xl text-gray-500">What is your fitness goal?</Text>
            <View className="gap-4 w-full px-5">
                <TouchableOpacity onPress={() => {
                    setGoal('lose_weight')
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md w-full h-[50px] flex justify-center items-center">
                    <Text className="font-[esemibold] text-gray-500 text-2xl px-4 py-2 text-center">Lose Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setGoal('maintain')
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md w-full h-[50px] flex justify-center items-center">
                    <Text className="font-[esemibold] text-gray-500 text-2xl px-4 py-2 text-center">Maintain</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setGoal('gain_weight')
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md w-full h-[50px] flex justify-center items-center">
                    <Text className="font-[esemibold] text-gray-500 text-2xl px-4 py-2 text-center">Gain Weight</Text>
                </TouchableOpacity>
            </View>

            {/* <View className={'absolute bottom-40'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md">
                    <Text className="font-[ebold] text-gray-500 text-2xl px-4 py-2">Get Started</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export default Goal