import { Text, TouchableOpacity, View } from "react-native"
import Slider from '@react-native-community/slider'
import Animated from "react-native-reanimated"
import { useMeasureStore } from "@/stores/measure.store"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "expo-router";
import { useLanguageStore } from "@/stores/language.store";

const Fast = () => {

    let { nextPage, fast, setFast, setCurrent, current } = useMeasureStore()
    const { t, locale } = useLanguageStore()

    return (
        <View className="flex-1 bg-white px-6" key={locale}>

            {/* ปุ่ม Back (สไตล์วงกลมแบบเดียวกับหน้าก่อนๆ) */}
            <TouchableOpacity
                className="absolute top-16 left-6 w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex justify-center items-center z-10"
                onPress={() => setCurrent(current - 1)}
            >
                <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>

            {/* Header Section */}
            <View className="items-center mt-36 mb-6">
                <Text className="font-[ebold] text-3xl text-gray-800 mb-3 text-center">
                    {t('deficitTitle')}
                </Text>
                <Text className="font-[emedium] text-base text-gray-500 text-center px-4 leading-relaxed">
                    {t('deficitDesc')}
                </Text>
            </View>

            {/* Center Content: Slider & Result Card */}
            <View className="flex-1 justify-center items-center w-full mt-[-20px]">
                <View className="bg-gray-50 py-8 px-6 rounded-[32px] w-full items-center border border-gray-100 shadow-sm shadow-gray-100">

                    {/* ตัวเลข Kcal ใหญ่ๆ */}
                    <View className="flex-row items-baseline mb-3">
                        <Text className="font-[ebold] text-6xl text-gray-900 tracking-tighter">{fast}</Text>
                        <Text className="font-[ebold] text-xl text-gray-400 ml-2">{t('kcal')}</Text>
                    </View>

                    {/* Badge แสดงน้ำหนักที่ลดได้ */}
                    <View className="bg-blue-100 px-4 py-2 rounded-full mb-8 border border-blue-200">
                        <Text className="font-[ebold] text-blue-600 text-sm">
                            ≈ {
                                fast >= 500 ? '0.45' :
                                    fast >= 400 ? '0.36' :
                                        fast >= 300 ? '0.27' :
                                            fast >= 200 ? '0.18' :
                                                fast >= 100 ? '0.09' : '0'
                            } {t('kgPerWeek')}
                        </Text>
                    </View>

                    {/* Slider */}
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={100}
                        maximumValue={500}
                        step={100}
                        value={fast}
                        onValueChange={(value: any) => setFast(Number(value))}
                        minimumTrackTintColor="#1F2937" // สีเข้มให้เข้ากับธีม
                        maximumTrackTintColor="#D1D5DB"
                        thumbTintColor="#1F2937"
                    />

                    {/* ตัวเลขกำกับหัวท้าย Slider */}
                    <View className="w-full flex-row justify-between mt-1 px-1">
                        <Text className="text-xs font-[ebold] text-gray-400">100</Text>
                        <Text className="text-xs font-[ebold] text-gray-400">500</Text>
                    </View>

                </View>
            </View>

            {/* Bottom Action: Disclaimer & Continue Button */}
            <Animated.View className="w-full mt-auto mb-12">

                {/* ข้อความอ้างอิงและคำเตือน */}
                <Text className="font-[emedium] text-center text-xs text-gray-400 mb-5 px-2 leading-relaxed">
                    {t('wishnofskyDisclaimer')}{' '}
                    <Link style={{ color: '#3B82F6', fontWeight: 'bold' }} href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calories/art-20048065">
                        {t('openLink')}
                    </Link>
                </Text>

                {/* ปุ่ม Start */}
                <TouchableOpacity
                    onPress={() => nextPage()}
                    activeOpacity={0.85}
                    className="w-full rounded-[24px] bg-gray-900 py-4 items-center flex justify-center shadow-md shadow-gray-400/30"
                >
                    <Text className="font-[ebold] text-white text-xl tracking-wide">
                        {t('startJourney')}
                    </Text>
                </TouchableOpacity>

            </Animated.View>

        </View>
    )
}

export default Fast