// components/BMITimeline.tsx
import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { useFocusEffect } from 'expo-router'
import { User } from '@/class/user.class'
import { useLanguageStore } from '@/stores/language.store'

const ZONES = [
    { max: 18.5, key: 'underweight', range: '< 18.5', color: '#185FA5', bg: '#E6F1FB' },
    { max: 23, key: 'normalWeight', range: '18.5–22.9', color: '#3B6D11', bg: '#EAF3DE' },
    { max: 25, key: 'overweight', range: '23–24.9', color: '#854F0B', bg: '#FAEEDA' },
    { max: 30, key: 'obese', range: '25–29.9', color: '#854F0B', bg: '#FFF3E0' },
    { max: 99, key: 'extremelyObese', range: '≥ 30', color: '#A32D2D', bg: '#FCEBEB' },
] as const;

const SEGMENTS = [
    { from: 10, to: 18.5, color: '#85B7EB', key: 'thin' },
    { from: 18.5, to: 23, color: '#97C459', key: 'normal' },
    { from: 23, to: 25, color: '#FAC775', key: 'chubby' },
    { from: 25, to: 30, color: '#EF9F27', key: 'obese' },
    { from: 30, to: 45, color: '#F09595', key: 'extremelyObese' },
] as const;

const MIN = 10
const MAX = 45

function getZone(bmi: number) {
    return ZONES.find((z) => bmi < z.max) ?? ZONES[ZONES.length - 1]
}

function bmiToPercent(bmi: number) {
    return ((Math.min(Math.max(bmi, MIN), MAX) - MIN) / (MAX - MIN)) * 100
}

export default function BMITimeline() {
    const [bmi, setBmi] = useState(0)
    const { t, locale } = useLanguageStore()
    const zone = getZone(bmi)
    const markerPercent = bmiToPercent(bmi)

    useFocusEffect(useCallback(() => {
        (async () => {
            let u = new User()
            let res = await u.getUserData()
            const bmi = res.weight / ((res.height / 100) ** 2)
            setBmi(bmi)
        })()
    }, []))

    if (!bmi) {
        return null
    }

    return (
        <View className="flex-1 bg-white px-5 pt-10 rounded-2xl border-gray-200">
            {/* Status Card */}
            <View
                className="rounded-2xl mb-4 flex-row items-center"
                style={{ backgroundColor: zone.bg, padding: 20 }}
            >
                {/* BMI Value */}
                <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-400 font-[ebold] uppercase" style={{ marginBottom: 4, letterSpacing: 1 }}>
                        BMI
                    </Text>
                    <Text className="text-5xl font-[ebold]" style={{ color: zone.color }}>
                        {bmi.toFixed(1)}
                    </Text>
                </View>

                <View className="w-px self-stretch bg-gray-200 mx-2" />

                {/* Status */}
                <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-400 font-[emedium] uppercase" style={{ marginBottom: 4, letterSpacing: 1 }}>
                        {t('statusLabel')}
                    </Text>
                    <Text className="text-base font-[ebold]" style={{ color: zone.color }}>
                        {t(zone.key as any)}
                    </Text>
                    <Text className="text-xs text-gray-400 font-[emedium]" style={{ marginTop: 2 }}>
                        {zone.range}
                    </Text>
                </View>
            </View>

            {/* Timeline Bar */}
            <View className="mb-2">
                <View className="relative h-7 rounded-full overflow-hidden flex-row">
                    {SEGMENTS.map((seg) => {
                        const width = ((seg.to - seg.from) / (MAX - MIN)) * 100
                        return (
                            <View
                                key={seg.key}
                                style={{ width: `${width}%`, backgroundColor: seg.color }}
                                className="h-full justify-center items-center"
                            >
                                <Text style={{ fontSize: 9, color: 'white', fontFamily: 'ebold' }}>
                                    {t(seg.key as any)}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                {/* Marker */}
                <View
                    className="absolute"
                    style={{ left: `${markerPercent}%`, marginLeft: -10, top: -4 }}
                    pointerEvents="none"
                >
                    <View className="w-5 h-9 items-center justify-center">
                        <View
                            className="w-5 h-5 rounded-full bg-white border-2"
                            style={{
                                borderColor: zone.color,
                                shadowColor: zone.color,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                        />
                    </View>
                </View>
            </View>

            {/* Tick Labels */}
            <View className="flex-row justify-between px-0" style={{ marginBottom: 24 }}>
                {[10, 18.5, 23, 25, 30, 45].map((tick) => (
                    <Text key={tick} className="text-xs font-[emedium] text-gray-400">
                        {tick}
                    </Text>
                ))}
            </View>
        </View>
    )
}