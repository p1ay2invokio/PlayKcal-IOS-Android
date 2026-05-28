import { useMeasureStore } from "@/stores/measure.store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated";
import { RulerPicker } from 'react-native-ruler-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const Height = () => {

    let navigate = useRouter()

    let { nextPage, previousPage, setHeight, current, setCurrent } = useMeasureStore()

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="font-[ebold] text-gray-500 text-2xl absolute top-30">Current Height ?</Text>

            <TouchableOpacity className="absolute top-15 left-5 p-2" onPress={() => setCurrent(current - 1)}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <RulerPicker

                min={140}
                max={220}
                step={1}
                fractionDigits={0}
                initialValue={150}
                decelerationRate={'normal'}
                onValueChangeEnd={(number: any) => setHeight(number)}
                unit="cm"
                height={60}
                width={300}
                //@ts-ignore
                unitTextStyle={{ fontSize: 16, color: '#888', fontFamily: 'mbold' }}
                //@ts-ignore
                valueTextStyle={{ fontSize: 24, color: '#000', fontWeight: 'bold', minWidth: 70, textAlign: 'center' }}
            />

            <Animated.View className={'absolute bottom-40'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className=" rounded-2xl bg-black py-1">
                    <Text className="font-[ebold] text-white text-2xl px-4 py-2">Continue</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Height