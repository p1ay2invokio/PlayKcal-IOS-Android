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
import { BarChart, PieChart } from 'react-native-gifted-charts'
import { useLanguageStore } from "@/stores/language.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 70; // ความกว้างของกรอบที่มองเห็น (Viewport)


const Recap = () => {
    let [barData, setBarData] = useState<any>([])
    let [currentWeight, setCurrentWeight] = useState("")
    let [modal, setModal] = useState(false)
    const { t, locale } = useLanguageStore()
    const insets = useSafeAreaInsets()
    console.log("RECAP RENDER: locale =", locale, "t(macroDistribution) =", t('macroDistribution'))

    useEffect(() => {
        (async () => {
            let s = new Stat()
            let res = await s.getStat(7)
            setBarData(res)
        })()
    }, [])

    const formattedBarData = barData.map((item: any) => ({
        ...item,
        label: item.date ? dayjs(item.date).format("D") : item.label
    }))

    const totalProtein = barData.reduce((sum: number, item: any) => sum + (item.protein || 0), 0)
    const totalCarbs = barData.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0)
    const totalFat = barData.reduce((sum: number, item: any) => sum + (item.fat || 0), 0)
    const totalMacros = totalProtein + totalCarbs + totalFat

    const proteinPercent = totalMacros > 0 ? Math.round((totalProtein / totalMacros) * 100) : 0
    const carbsPercent = totalMacros > 0 ? Math.round((totalCarbs / totalMacros) * 100) : 0
    const fatPercent = totalMacros > 0 ? Math.round((totalFat / totalMacros) * 100) : 0

    const hasData = totalMacros > 0

    const pieData = hasData
        ? [
            { value: totalProtein, color: '#ef4444', text: `${proteinPercent}%` },
            { value: totalCarbs, color: '#22c55e', text: `${carbsPercent}%` },
            { value: totalFat, color: '#3b82f6', text: `${fatPercent}%` },
          ]
        : [
            { value: 1, color: '#f1f5f9', text: '' }
          ]

    return (
        <View className="flex-1" key={locale}>
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                contentContainerStyle={{
                    paddingTop: insets.top > 0 ? insets.top : 20,
                    paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 100,
                    paddingHorizontal: 20,
                    gap: 16,
                }}
                showsVerticalScrollIndicator={false}
            >

                <View className="border border-gray-200 rounded-3xl shadow-gray-200 shadow-sm p-3">
                    <BMITimeline></BMITimeline>
                </View>

                <View className="bg-white p-5 rounded-3xl mt-4 border border-gray-100 shadow-sm shadow-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <View className="mb-6">
                        <Text className="font-[ebold] text-2xl text-gray-800">
                            {t('caloriesHistory')}
                        </Text>
                        <Text className="font-[emedium] text-sm text-gray-400 mt-1">
                            {t('last7DaysTotal')}
                        </Text>
                    </View>

                    <BarChart
                        data={formattedBarData}
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
                                    {t('kcalLabel')}
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

                {/* Macronutrient Distribution Card */}
                <View className="bg-white p-5 rounded-3xl mt-4 border border-gray-100 shadow-sm shadow-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <View className="mb-6">
                        <Text className="font-[ebold] text-2xl text-gray-800">
                            {t('macroDistribution')}
                        </Text>
                        <Text className="font-[emedium] text-sm text-gray-400 mt-1">
                            {t('totalIntake')} (7 {locale === 'th' ? 'วันล่าสุด' : 'days'})
                        </Text>
                    </View>

                    {hasData ? (
                        <View className="flex-row items-center justify-between">
                            {/* Chart on the left */}
                            <View className="items-center justify-center relative" style={{ width: screenWidth * 0.4 }}>
                                <PieChart
                                    data={pieData}
                                    donut
                                    showText
                                    textColor="white"
                                    textSize={10}
                                    radius={55}
                                    innerRadius={35}
                                    innerCircleColor={'white'}
                                    centerLabelComponent={() => (
                                        <View className="justify-center items-center">
                                            <Text className="font-[ebold] text-base text-slate-800">
                                                {Math.round(totalMacros)}g
                                            </Text>
                                            <Text className="font-[emedium] text-[10px] text-slate-400">
                                                {t('total')}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Legend / Details on the right */}
                            <View className="flex-1 gap-y-3 pl-4">
                                {/* Protein */}
                                <View className="flex-row items-center justify-between bg-red-50/50 p-2.5 rounded-2xl border border-red-100/30">
                                    <View className="flex-row items-center gap-2">
                                        <View className="w-3 h-3 rounded-full bg-red-500" />
                                        <Text className="font-[ebold] text-slate-700 text-sm">{t('protein')}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-[ebold] text-slate-800 text-sm">{Math.round(totalProtein)}g</Text>
                                        <Text className="font-[emedium] text-xs text-red-500">{proteinPercent}%</Text>
                                    </View>
                                </View>

                                {/* Carbs */}
                                <View className="flex-row items-center justify-between bg-green-50/50 p-2.5 rounded-2xl border border-green-100/30">
                                    <View className="flex-row items-center gap-2">
                                        <View className="w-3 h-3 rounded-full bg-green-500" />
                                        <Text className="font-[ebold] text-slate-700 text-sm">{t('carbs')}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-[ebold] text-slate-800 text-sm">{Math.round(totalCarbs)}g</Text>
                                        <Text className="font-[emedium] text-xs text-green-500">{carbsPercent}%</Text>
                                    </View>
                                </View>

                                {/* Fat */}
                                <View className="flex-row items-center justify-between bg-blue-50/50 p-2.5 rounded-2xl border border-blue-100/30">
                                    <View className="flex-row items-center gap-2">
                                        <View className="w-3 h-3 rounded-full bg-blue-500" />
                                        <Text className="font-[ebold] text-slate-700 text-sm">{t('fat')}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-[ebold] text-slate-800 text-sm">{Math.round(totalFat)}g</Text>
                                        <Text className="font-[emedium] text-xs text-blue-500">{fatPercent}%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="py-10 items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Ionicons name="pie-chart-outline" size={48} color="#cbd5e1" />
                            <Text className="font-[emedium] text-slate-400 mt-2 text-sm text-center px-4">
                                {t('noMacroData')}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Recap