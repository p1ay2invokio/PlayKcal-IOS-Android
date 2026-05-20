import { ActivityIndicator, TouchableOpacity, View } from "react-native"
import { Camera, CameraView, CameraViewRef } from "expo-camera"
import Icon from "@expo/vector-icons/Ionicons"
import { use, useRef, useState } from "react"
import { analysis_food } from "@/methods/gemini.method"
import { router } from "expo-router"
import Loading from "@/components/loading"
import { useCurrentPickDate } from "@/stores/date.store"
import dayjs from "dayjs"

const Scan = () => {

    let cameraRef = useRef<CameraView>(null)


    let [loading, setLoading] = useState(false)

    let {currentDate} = useCurrentPickDate()


    const takePicture = async () => {
        if (cameraRef.current) {


            setLoading(true)

            let photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                base64: false,
                exif: false
            })


            console.log(photo)

            if (photo) {


                let convert_thai = dayjs(currentDate).format("DD-MM-YYYY")
                
                let res = await analysis_food(photo, convert_thai)


                if (res.statusCode === 201) {
                    router.replace("/(tabs)/home")
                    setLoading(false)
                }
            }
        }

    }

    return (
        <View className="flex-1">

            <CameraView ref={cameraRef} style={{ flex: 1, zIndex: -2 }} facing="back" />

            {loading ? <Loading></Loading> : null}

            {!loading ? <View style={{ zIndex: -1 }} className="absolute bottom-[50%] w-full flex-row justify-center items-center">
                <View className="w-[45px] absolute h-[4px] rounded-sm bg-white"></View>
                <View className="w-[40px] absolute rotate-90 h-[4px] rounded-sm bg-white"></View>
            </View> : null}

            {!loading ? <View className="absolute bottom-20 w-full flex-row justify-center items-center">
                <View className="w-[90px] absolute h-[90px] bg-white/60 rounded-full"></View>
                <TouchableOpacity onPress={takePicture} activeOpacity={0.7} className="w-[70px] h-[70px] bg-white rounded-full"></TouchableOpacity>
            </View> : null}
        </View>
    )
}

export default Scan