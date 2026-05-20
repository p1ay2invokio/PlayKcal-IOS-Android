import { useMeasureStore } from "@/stores/measure.store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated";
import { RulerPicker } from 'react-native-ruler-picker';

const Height = () => {

    let navigate = useRouter()

    let {nextPage, previousPage, setHeight} = useMeasureStore()

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="font-[ebold] text-gray-500 text-2xl absolute top-30">Current Height</Text>

            <RulerPicker

                min={140}
                max={220}
                step={1}
                fractionDigits={1}
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

            <Animated.View className={'absolute bottom-60'}>
                <TouchableOpacity onPress={() => {
                    nextPage()
                }} activeOpacity={0.7} className="border border-gray-300 rounded-md">
                    <Text className="font-[ebold] text-gray-500 text-2xl px-4 py-2">Next Step</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default Height