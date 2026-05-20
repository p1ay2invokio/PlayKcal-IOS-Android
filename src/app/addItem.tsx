import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "@expo/vector-icons/Ionicons"
import { Image } from "expo-image"
import Back from "@/components/back"
import {useCameraPermissions} from 'expo-camera'
import { router } from "expo-router"

const AddItem = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, gap: 10, backgroundColor: "white" }}>

            <View className="flex flex-row gap-2 mb-5">
                <Back></Back>
                <Text className="font-[ebold] text-xl">Add Food</Text>
            </View>

            <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={async () => {
                let res = await requestCameraPermission()

                if(res.status === "granted"){
                    router.push("/scan")
                }
                console.log(res)
            }}>
                <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/gemini-color.png')}></Image>
                <Text className="font-[ebold] text-gray-700 text-lg">Scan Food</Text>
            </TouchableOpacity>


            <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={() => {
                console.log("Item added");
            }}>
                <Icon name="archive-outline" size={24}></Icon>
                <Text className="font-[ebold] text-gray-700 text-lg">Manually Add</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border py-4 px-3 rounded-xl border-gray-300 flex flex-row items-center gap-3" activeOpacity={0.7} onPress={() => {
                console.log("Item added");
            }}>
                <Image style={{ width: 25, height: 25 }} source={require('../../assets/images/heart.png')}></Image>
                <Text className="font-[ebold] text-gray-700 text-lg">Add My Favorites</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


export default AddItem