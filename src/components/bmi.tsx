// components/BMITimeline.tsx
import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { useFocusEffect } from 'expo-router'
import { User } from '@/class/user.class'

const ZONES = [
    { max: 18.5, label: 'ผอมเกินไป', range: '< 18.5', color: '#185FA5', bg: '#E6F1FB' },
    { max: 23, label: 'น้ำหนักปกติ', range: '18.5–22.9', color: '#3B6D11', bg: '#EAF3DE' },
    { max: 25, label: 'น้ำหนักเกิน (ท้วม)', range: '23–24.9', color: '#854F0B', bg: '#FAEEDA' },
    { max: 30, label: 'อ้วน', range: '25–29.9', color: '#854F0B', bg: '#FFF3E0' },
    { max: 99, label: 'อ้วนมาก', range: '≥ 30', color: '#A32D2D', bg: '#FCEBEB' },
]

const SEGMENTS = [
    { from: 10, to: 18.5, color: '#85B7EB', label: 'ผอม' },
    { from: 18.5, to: 23, color: '#97C459', label: 'ปกติ' },
    { from: 23, to: 25, color: '#FAC775', label: 'ท้วม' },
    { from: 25, to: 30, color: '#EF9F27', label: 'อ้วน' },
    { from: 30, to: 45, color: '#F09595', label: 'อ้วนมาก' },
]

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
    const zone = getZone(bmi)
    const markerPercent = bmiToPercent(bmi)

    useFocusEffect(useCallback(() => {
        (async () => {
            let u = new User()


            let res = await u.getUserData()


            const bmi = res.weight / ((res.height / 100) ** 2)

            console.log(res)
            setBmi(bmi)
        })()
    }, []))

    if(!bmi){
        return null
    }

    return (
        <View className="flex-1 bg-white px-5 pt-10 rounded-2xl  border-gray-200">

            {/* Status card */}
            <View
                className="rounded-2xl p-4 mb-3 flex-row items-center gap-4 "
                style={{ backgroundColor: zone.bg }}
            >
                <View>
                    <Text className="text-xs text-gray-500 mb-1">BMI</Text>
                    <Text className="text-4xl font-medium" style={{ color: zone.color }}>
                        {bmi.toFixed(1)}
                    </Text>
                </View>
                <View className="w-px self-stretch bg-gray-200 mx-2" />
                <View>
                    <Text className="text-xs text-gray-500 mb-1 font-[emedium]">Status</Text>
                    <Text className="text-sm font-[esemibold]" style={{ color: zone.color }}>
                        {zone.label}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5 font-[emedium]">{zone.range}</Text>
                </View>

            </View>

            {/* Timeline bar */}
            <View className="mb-2">
                <View className="relative h-6 rounded-full overflow-hidden flex-row">
                    {SEGMENTS.map((seg) => {
                        const width = ((seg.to - seg.from) / (MAX - MIN)) * 100
                        return (
                            <View
                                key={seg.label}
                                style={{ width: `${width}%`, backgroundColor: seg.color }}
                                className="h-full justify-center items-center "
                            >
                                <Text style={{ fontSize: 9, color: 'white', fontWeight: '600', fontFamily: 'emedium' }}>
                                    {seg.label}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                {/* Marker */}
                <View
                    className="absolute -top-1"
                    style={{ left: `${markerPercent}%`, marginLeft: -10 }}
                    pointerEvents="none"
                >
                    <View
                        className="w-5 h-8 items-center justify-center"
                    >
                        <View
                            className="w-4 h-4 rounded-full bg-white border-2"
                            style={{ borderColor: zone.color }}
                        />
                    </View>
                </View>
            </View>

            {/* Tick labels */}
            <View className="flex-row justify-between mb-6 px-0">
                {[10, 18.5, 23, 25, 30, 45].map((tick) => (
                    <Text key={tick} className="text-xs font-[emedium] text-gray-400">
                        {tick}
                    </Text>
                ))}
            </View>
        </View>
    )
}