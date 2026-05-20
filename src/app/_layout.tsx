import { Stack } from "expo-router";
import '../../global.css'
import { useFonts } from 'expo-font'

import { router, Slot } from "expo-router";
import { useEffect, useState } from "react";
import cookie from '@react-native-async-storage/async-storage'

export default function Layout() {


    const [checked, setChecked] = useState(false);

    let fonts = useFonts({
        'light': require('../../assets/fonts/Kanit-Light.ttf'),
        'regular': require('../../assets/fonts/Kanit-Regular.ttf'),
        'medium': require('../../assets/fonts/Kanit-Medium.ttf'),
        'semibold': require('../../assets/fonts/Kanit-SemiBold.ttf'),
        'bold': require('../../assets/fonts/Kanit-Bold.ttf'),
        'mregular': require('../../assets/fonts/MinecraftRegular-Bmg3.otf'),
        'mbold': require('../../assets/fonts/MinecraftBold-nMK1.otf'),
        'eregular': require('../../assets/fonts/GoogleSans-Regular.ttf'),
        'emedium': require('../../assets/fonts/GoogleSans-Medium.ttf'),
        'esemibold': require('../../assets/fonts/GoogleSans-SemiBold.ttf'),
        'ebold': require('../../assets/fonts/GoogleSans-Bold.ttf'),
    })


    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="personalized" options={{ headerShown: false }} />
            <Stack.Screen name="addItem" options={{ headerShown: false }} />
            <Stack.Screen name="scan" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        </Stack>
    );
}