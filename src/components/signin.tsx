import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import Line, { Scope, BotPrompt } from '@xmartlabs/react-native-line'
import { useEffect } from "react"
import { GoogleSignin, } from '@react-native-google-signin/google-signin'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { useMeasureStore } from "@/stores/measure.store"
import axios from 'axios'
import cookie from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router"

const Signin = () => {


    let navigate = useRouter()

    const GoogleLogin = async () => {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()

        return userInfo
    }

    const AppleLogin = async () => {
        const appleRequest = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        })

        const credentialState = await appleAuth.getCredentialStateForUser(appleRequest.user)

        if (credentialState === appleAuth.State.AUTHORIZED) {
            console.log("Login Success")
            // const {email, fullName, user, identityToken} = appleRequest

            return appleRequest
        }
    }


    let { sex, dob, fast, weight, height, goal, targetWeight } = useMeasureStore()


    useEffect(() => {
        Line.setup({ channelId: '2010106219', redirectUri: 'com.play21947.my-app://' })

        GoogleSignin.configure({
            iosClientId: '142861096280-rng79cit1lv79i2ltf62crrt6g5dracu.apps.googleusercontent.com',
        })

        return appleAuth.onCredentialRevoked(async () => {
            console.warn('If this function executes, User Credentials have been Revoked');
        });
    }, [])

    return (
        <View className="flex-1 justify-center items-center bg-white gap-5">

            <TouchableOpacity onPress={async () => {
                let res = await Line.login({
                    scopes: [Scope.Profile, Scope.OpenId],
                })

                let userId = res.userProfile?.userId
                let displayName = res.userProfile?.displayName
                let pictureUrl = res.userProfile?.pictureUrl

                let formData = new FormData()

                formData.append("userId", userId!)
                formData.append("displayName", displayName!)
                formData.append("pictureUrl", pictureUrl!)
                formData.append("sex", sex)
                formData.append("dob", dob)
                formData.append("fast", fast)
                formData.append("weight", weight)
                formData.append("height", height)
                formData.append("goal", goal)
                formData.append("targetWeight", targetWeight)

                let { data } = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/line`, formData)

                if(data.statusCode === 201 || data.statusCode === 200){
                    cookie.setItem("token", data.token)
                    navigate.replace("/personalized")
                }

            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50px] rounded-xl bg-green-600 flex justify-between px-14 items-center">
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/line.png')} />

                <Text className="text-white font-[ebold] text-xl">Continue with LINE</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
                let data = await GoogleLogin()

                let userId = data.data?.user.id
                let displayName = data.data?.user.name
                let pictureUrl = data.data?.user.photo
                let email = data.data?.user.email


            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50] rounded-xl border border-gray-300 flex justify-between px-14 items-center">
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/search.png')} />

                <Text className="text-gray-700 font-[ebold] text-xl">Continue with Google</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={async () => {
                let data = await AppleLogin()


                let userId = data?.user
                let displayName = data?.fullName?.givenName
                let email = data?.email


            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50] rounded-xl border border-gray-300 flex justify-between px-14 items-center">
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/apple-logo.png')} />

                <Text className="text-gray-700 font-[ebold] text-xl">Continue with Apple</Text>
            </TouchableOpacity>


            {/* <TouchableOpacity onPress={() => {
                console.log(sex, dob, fast, weight, height, goal, targetWeight)
            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50] rounded-xl border border-gray-300 flex justify-between px-14 items-center">

                <Text className="text-gray-700 font-[ebold] text-xl">Check</Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default Signin