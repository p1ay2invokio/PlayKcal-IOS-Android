import { TouchableOpacity, View } from "react-native"
import Icon from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"

const Back = () => {
    return (
        <TouchableOpacity onPress={()=>{
            router.back()
        }}>
            <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
    )
}

export default Back