import { useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"
import cookie from '@react-native-async-storage/async-storage'
import { Ionicons } from "@expo/vector-icons"
import { useLanguageStore } from "@/stores/language.store"

const { width } = Dimensions.get('window')

export default function Onboarding() {
    const { t } = useLanguageStore()
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollRef = useRef<ScrollView>(null)
    const insets = useSafeAreaInsets()

    const slides = [
        {
            title: t('onboardingTitle1'),
            desc: t('onboardingDesc1'),
            icon: "camera-outline" as const,
            color: "#10b981", // emerald
            bg: "#ecfdf5",
        },
        {
            title: t('onboardingTitle2'),
            desc: t('onboardingDesc2'),
            icon: "analytics-outline" as const,
            color: "#3b82f6", // blue
            bg: "#eff6ff",
        },
        {
            title: t('onboardingTitle3'),
            desc: t('onboardingDesc3'),
            icon: "heart-outline" as const,
            color: "#ef4444", // red
            bg: "#fef2f2",
        },
    ]

    const handleScroll = (event: any) => {
        const x = event.nativeEvent.contentOffset.x
        const index = Math.round(x / width)
        if (index !== activeIndex) {
            setActiveIndex(index)
        }
    }

    const finishOnboarding = async () => {
        await cookie.setItem("hasSeenOnboarding", "true")
        router.replace("/register")
    }

    const currentThemeColor = slides[activeIndex].color

    return (
        <View className="flex-1 bg-white">
            {/* Scrollable Presentation Slides */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="flex-grow"
            >
                {slides.map((slide, index) => (
                    <View 
                        key={index}
                        style={{ width, paddingTop: insets.top + 60 }}
                        className="items-center justify-center px-8"
                    >
                        {/* Decorative background blobs for visual depth */}
                        <View className="relative w-72 h-72 items-center justify-center mb-10">
                            {/* Inner soft blur circle */}
                            <View 
                                style={{ backgroundColor: slide.bg, transform: [{ scale: 1.1 }] }}
                                className="absolute w-64 h-64 rounded-full"
                            />
                            
                            {/* Decorative ring */}
                            <View 
                                style={{ borderColor: slide.color + '20' }}
                                className="absolute w-72 h-72 rounded-full border border-dashed"
                            />

                            {/* Main Icon container */}
                            <View 
                                style={{ backgroundColor: 'white', shadowColor: slide.color }}
                                className="w-44 h-44 rounded-[40px] items-center justify-center shadow-lg elevation-8 border border-slate-50"
                            >
                                <Ionicons name={slide.icon} size={72} color={slide.color} />
                            </View>

                            {/* Accent dots */}
                            <View style={{ backgroundColor: slide.color }} className="absolute top-10 right-10 w-4 h-4 rounded-full opacity-60" />
                            <View style={{ backgroundColor: slide.color }} className="absolute bottom-12 left-8 w-6 h-6 rounded-full opacity-30" />
                        </View>

                        {/* Slide Content */}
                        <View className="items-center mt-4 gap-4">
                            <Text className="font-[ebold] text-3xl text-slate-800 text-center px-4 leading-tight">
                                {slide.title}
                            </Text>
                            <Text className="font-[emedium] text-base text-slate-500 text-center leading-relaxed px-2">
                                {slide.desc}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Section */}
            <View 
                style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 30 }}
                className="items-center w-full mt-auto gap-6 px-8"
            >
                {/* Dot indicators */}
                <View className="flex-row gap-2">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={{ 
                                width: activeIndex === index ? 24 : 8,
                                backgroundColor: activeIndex === index ? currentThemeColor : '#e2e8f0'
                            }}
                            className="h-2 rounded-full transition-all duration-300"
                        />
                    ))}
                </View>

                {/* Register Button - only visible on the final page */}
                {activeIndex === slides.length - 1 ? (
                    <TouchableOpacity 
                        onPress={finishOnboarding}
                        activeOpacity={0.8}
                        style={{ backgroundColor: currentThemeColor }}
                        className="w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
                    >
                        <Text className="font-[ebold] text-white text-base">
                            {t('getStarted')}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color="white" />
                    </TouchableOpacity>
                ) : (
                    // Empty placeholder with equivalent height to prevent layout jump
                    <View className="h-[56px] w-full" />
                )}
            </View>
        </View>
    )
}
