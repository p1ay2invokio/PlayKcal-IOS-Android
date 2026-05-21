import { Stack } from "expo-router";
import '../../global.css'
import { useFonts } from 'expo-font'
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [fontsLoaded, fontError] = useFonts({
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
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="personalized" options={{ headerShown: false }} />
            <Stack.Screen name="addItem" options={{ headerShown: false }} />
            <Stack.Screen name="scan" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
    );
}