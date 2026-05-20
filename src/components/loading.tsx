import { ActivityIndicator, View } from "react-native"

const Loading=()=>{
    return(
        <View style={{zIndex: 999}} className="w-full h-full flex-1 absolute bg-black/80 flex justify-center items-center">
            <ActivityIndicator color="white" size="large" />
        </View>
    )
}

export default Loading