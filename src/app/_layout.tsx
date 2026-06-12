import { Stack } from "expo-router";
import '../../global.css'
import { useFonts } from 'expo-font'
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device';
import { Alert } from "react-native";
import messaging from '@react-native-firebase/messaging'
import { useLanguageStore } from "@/stores/language.store";

SplashScreen.preventAutoHideAsync();



messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
})

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


    const requestPermissionNoti = async () => {

        await messaging().registerDeviceForRemoteMessages();

        let authStatus = await messaging().requestPermission();
        console.log('Authorization status:', authStatus);
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;


        if (enabled) {
            console.log(authStatus)

            const token = await messaging().getToken();
            console.log('Device FCM Token:', token);
        }

    }

    useEffect(() => {
        useLanguageStore.getState().loadLocale();
        requestPermissionNoti();

        const fore = messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground!', remoteMessage);
        })

        // 🟡 3. ตอนแอปอยู่ Background แล้วผู้ใช้ "กด" ที่แถบแจ้งเตือนเพื่อเปิดแอปเข้ามา
        const open = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage);
            // คุณสามารถเขียนโค้ดเพื่อเปลี่ยนหน้า (Navigation) ไปยังหน้าเฉพาะเจาะจงตรงนี้ได้ เช่น:
            // router.push(`/product/${remoteMessage.data.id}`);
        })

        // 🔴 4. ตอนแอปปิดสนิท (Quit State) แล้วผู้ใช้ "กด" ที่แถบแจ้งเตือนเพื่อเปิดแอปขึ้นมาใหม่
        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage);
                // คุณสามารถเขียนโค้ดเพื่อเปลี่ยนหน้า (Navigation) ไปยังหน้าเฉพาะเจาะจงตรงนี้ได้ เช่น:
                // router.push(`/product/${remoteMessage.data.id}`);
            }
        })


        return () => {
            fore();
            open();
        };

    }, []);

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
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="personalized" options={{ headerShown: false }} />
            <Stack.Screen name="addItem" options={{ headerShown: false }} />
            <Stack.Screen name="scan" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="manual/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="exercise" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="ex/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="exm/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="editProfile" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
    );
}