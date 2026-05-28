import { ActivityIndicator, Text, View } from "react-native"
import LottieView from "lottie-react-native";

const Loading = () => {
    return (
        <View style={{ zIndex: 999 }} className="w-full h-full flex-1 absolute bg-[#000]/80 flex justify-center items-center">
            <LottieView
                source={require('../../assets/lotties/rabbit2.json')}
                style={{ width: "60%", height: "60%" }}
                autoPlay
                loop
            />
            <Text className="font-[esemibold] text-2xl text-white absolute bottom-[30%]">Thinking...</Text>
        </View>
    )
}

export default Loading