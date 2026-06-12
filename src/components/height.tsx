import { useMeasureStore } from "@/stores/measure.store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated";
import { RulerPicker } from 'react-native-ruler-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguageStore } from "@/stores/language.store";

const Height = () => {

    let navigate = useRouter()

    let { nextPage, previousPage, setHeight, current, setCurrent } = useMeasureStore()
    const { t, locale } = useLanguageStore()

    return (
        <View className="flex-1 bg-white px-6" key={locale}>

            {/* ปุ่ม Back ทำเป็นปุ่มวงกลมสวยๆ (ตำแหน่งเดียวกับหน้า Gender) */}
            <TouchableOpacity
                className="absolute top-16 left-6 w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex justify-center items-center z-10"
                onPress={() => setCurrent(current - 1)}
            >
                <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>

            {/* Header Section (ดันลงมาให้อยู่ใต้ปุ่ม Back) */}
            <View className="items-center mt-36 mb-10">
                <Text className="font-[ebold] text-3xl text-gray-800 mb-3 text-center">
                    {t('whatsYourHeight')}
                </Text>
                <Text className="font-[emedium] text-base text-gray-500 text-center px-4">
                    {t('heightDesc')}
                </Text>
            </View>

            {/* Center Content: Ruler Picker */}
            <View className="flex-1 justify-center items-center w-full">
                <View className="bg-gray-50 py-10 px-4 rounded-[32px] w-full items-center border border-gray-100">
                    <RulerPicker
                        min={140}
                        max={220}
                        step={1}
                        fractionDigits={0}
                        initialValue={150}
                        decelerationRate={'normal'}
                        onValueChangeEnd={(number: any) => setHeight(number)}
                        unit={t('cm')}
                        height={60}
                        width={280}
                        //@ts-ignore
                        unitTextStyle={{ fontSize: 18, color: '#9CA3AF', fontFamily: 'mbold', marginBottom: 4 }}
                        //@ts-ignore
                        valueTextStyle={{ fontSize: 40, color: '#1F2937', fontWeight: 'bold', minWidth: 80, textAlign: 'center' }}
                    />
                </View>
            </View>

            {/* Bottom Action: Continue Button (ดันลงล่างสุดอัตโนมัติด้วย mt-auto) */}
            <Animated.View className="w-full mt-auto mb-12">
                <TouchableOpacity
                    onPress={() => nextPage()}
                    activeOpacity={0.85}
                    className="w-full rounded-[24px] bg-gray-900 py-4 items-center flex justify-center shadow-md shadow-gray-400/30"
                >
                    <Text className="font-[ebold] text-white text-xl tracking-wide">
                        {t('continueButton')}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

        </View>
    )
}

export default Height