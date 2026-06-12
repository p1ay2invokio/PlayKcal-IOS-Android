import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Camera, CameraView, CameraViewRef } from "expo-camera"
import * as ImagePicker from 'expo-image-picker';
import Icon from "@expo/vector-icons/Ionicons"
import { use, useEffect, useRef, useState } from "react"
import { analysis_food } from "@/methods/gemini.method"
import { router } from "expo-router"
import Loading from "@/components/loading"
import { useCurrentPickDate } from "@/stores/date.store"
import dayjs from "dayjs"
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguageStore } from "@/stores/language.store";


const audioSource = require('../../assets/sound/r1.mp3');

const Scan = () => {
    const player = useAudioPlayer(audioSource);
    let cameraRef = useRef<CameraView>(null)
    let [loading, setLoading] = useState(false)
    let { currentDate } = useCurrentPickDate()
    const { t } = useLanguageStore()

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true
        });
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const subscription = player.addListener('playbackStatusUpdate', (status) => {
            if (status.didJustFinish && loading) {
                timer = setTimeout(() => {
                    player.seekTo(0);
                    player.play();
                }, 2000);
            }
        });

        return () => {
            subscription.remove();
            if (timer) clearTimeout(timer);
        };
    }, [loading]);

    const takePicture = async () => {
        if (cameraRef.current) {
            player.play();
            setLoading(true);

            let photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                base64: false,
                exif: false
            });

            console.log(photo);

            if (photo) {
                let convert_thai = dayjs(currentDate).format("YYYY-MM-DD");
                let res = await analysis_food(photo, convert_thai);

                if (res.statusCode === 201) {
                    player.pause();
                    player.seekTo(0);
                    router.replace("/(tabs)/home");
                    setLoading(false);
                }
            }
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('error'), 'Permission to access media library is required!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const pickedPhoto = result.assets[0];
                player.play();
                setLoading(true);
                
                let convert_thai = dayjs(currentDate).format("YYYY-MM-DD");
                let res = await analysis_food(pickedPhoto as any, convert_thai);

                if (res.statusCode === 201) {
                    player.pause();
                    player.seekTo(0);
                    router.replace("/(tabs)/home");
                    setLoading(false);
                } else {
                    setLoading(false);
                    player.pause();
                    player.seekTo(0);
                    Alert.alert(t('error'), 'Failed to analyze food.');
                }
            }
        } catch (error) {
            console.error("Error picking image:", error);
            setLoading(false);
            Alert.alert(t('error'), 'An error occurred while picking the image.');
        }
    };

    return (
        <View className="flex-1 bg-black">

            {/* Camera Layer */}
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

            {/* Header / Top Controls (แก้จาก SafeAreaView เป็น View ปกติแล้วใส่ top-14) */}
            <View className="absolute top-14 w-full z-50 px-6 flex-row items-center justify-between">

                {/* ปุ่มปิด (Close) */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-12 h-12 bg-black/40 rounded-full flex justify-center items-center"
                    onPress={() => router.back()} // หรือฟังก์ชันปิดหน้ากล้องของคุณ
                >
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>

                {/* ป้ายกำกับ (Badge) */}
                <View className="bg-black/40 px-5 py-2 rounded-full">
                    <Text className="text-white font-[ebold] text-sm tracking-wide">
                        {t('aiFoodScanner')}
                    </Text>
                </View>

                {/* ช่องว่างเพื่อให้ Flex ดันป้ายกำกับให้อยู่ตรงกลางพอดี */}
                <View className="w-12 h-12" />
            </View>

            {/* Scanner Overlay (กรอบเป้าเล็ง 4 มุม) */}
            <View
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10"
                pointerEvents="none"
            >
                <View className="w-64 h-64 relative">
                    <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/90 rounded-tl-2xl" />
                    <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/90 rounded-tr-2xl" />
                    <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/90 rounded-bl-2xl" />
                    <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/90 rounded-br-2xl" />
                </View>
            </View>



            {loading ? <Loading></Loading> : null}

            {/* Bottom Controls (ปุ่มถ่ายภาพ / เลือกรูปภาพ / Loading) */}
            <View className="absolute bottom-12 w-full flex items-center justify-center z-20">

                {!loading ?
                    <View className="items-center w-full">

                        {/* คำแนะนำ */}
                        <Text className="text-white/90 font-[emedium] text-sm mb-6 drop-shadow-lg text-center">
                            {t('positionFoodCenter')}
                        </Text>

                        {/* Control Row */}
                        <View className="flex-row items-center justify-between w-full px-10">
                            {/* Dummy View to balance alignment */}
                            <View className="w-14 h-14" />

                            {/* Shutter button */}
                            <TouchableOpacity
                                onPress={takePicture}
                                activeOpacity={0.8}
                                className="w-[84px] h-[84px] rounded-full border-[4px] border-white/50 flex justify-center items-center"
                            >
                                <View className="w-[68px] h-[68px] bg-white rounded-full" />
                            </TouchableOpacity>

                            {/* Gallery picker */}
                            <TouchableOpacity
                                onPress={pickImage}
                                activeOpacity={0.7}
                                className="w-14 h-14 bg-black/40 border border-white/20 rounded-full flex justify-center items-center"
                            >
                                <Ionicons name="images" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                : null}

            </View>

        </View>
    )
}

export default Scan