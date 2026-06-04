import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import Line, { Scope, BotPrompt } from '@xmartlabs/react-native-line'
import { useEffect } from "react"
import { GoogleSignin, } from '@react-native-google-signin/google-signin'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { useMeasureStore } from "@/stores/measure.store"
import axios from 'axios'
import cookie from '@react-native-async-storage/async-storage'
import { router, useRouter } from "expo-router"
import Back from "./back"
import Ionicons from '@expo/vector-icons/Ionicons';

const Signin = () => {


    let navigate = useRouter()

    let { current, setCurrent } = useMeasureStore()

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


    let { sex, dob, fast, weight, height } = useMeasureStore()


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
        <View className="flex-1 bg-white px-6">

            {/* ปุ่ม Back */}
            <TouchableOpacity
                className="absolute top-16 left-6 w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex justify-center items-center z-10"
                onPress={() => setCurrent(weight ? current - 1 : 0)}
            >
                <Ionicons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>

            {/* Header Section */}
            <View className="items-center mt-36 mb-12">
                <Text className="font-[ebold] text-3xl text-gray-800 mb-3 text-center">
                    Almost there!
                </Text>
                <Text className="font-[emedium] text-base text-gray-500 text-center px-4 leading-relaxed">
                    Create an account or log in to save your personalized plan and track your progress.
                </Text>
            </View>

            {/* Login Buttons Container */}
            <View className="w-full gap-4">

                {/* LINE Button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={async () => {
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

                        let { data } = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/line`, formData)

                        if (data.statusCode === 201 || data.statusCode === 200) {
                            cookie.setItem("token", data.token)
                            navigate.replace("/personalized")
                        }
                    }}
                    className="w-full h-14 rounded-2xl bg-[#00C300] flex-row justify-center items-center relative shadow-sm shadow-green-200"
                >
                    <View className="absolute left-6 flex justify-center items-center">
                        <Image style={{ width: 24, height: 24 }} source={require('../../assets/images/line.png')} />
                    </View>
                    <Text className="text-white font-[ebold] text-lg tracking-wide">Continue with LINE</Text>
                </TouchableOpacity>

                {/* Google Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={async () => {
                        const data = await GoogleLogin();

                        if (data.type === 'success') {
                            const user = data.data.user;

                            const payload = {
                                provider: 'google',
                                providerId: user.id,
                                name: user.name,
                                email: user.email,
                                image: user.photo,
                                sex: sex || null,
                                dob: dob || null,
                                fast: fast ? parseFloat(fast) : null,
                                weight: weight ? parseFloat(weight) : null,
                                height: height ? parseFloat(height) : null,
                            };

                            try {
                                const response = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/google`, payload);
                                const result = response.data;

                                console.log('บันทึกข้อมูลและเข้าสู่ระบบสำเร็จ:', result);

                                if (result.statusCode === 201 || result.statusCode === 200) {
                                    cookie.setItem("token", result.token)
                                    navigate.replace("/personalized")
                                }

                            } catch (error: any) {
                                if (error.response) {
                                    console.error('เกิดข้อผิดพลาดจาก Server:', error.response.data);
                                } else if (error.request) {
                                    console.error('ไม่สามารถเชื่อมต่อกับ Server ได้:', error.request);
                                } else {
                                    console.error('ตั้งค่า Request ผิดพลาด:', error.message);
                                }
                            }
                        }
                    }}
                    className="w-full h-14 rounded-2xl bg-white border border-gray-200 flex-row justify-center items-center relative shadow-sm shadow-gray-100"
                >
                    <View className="absolute left-6 flex justify-center items-center">
                        <Image style={{ width: 24, height: 24 }} source={require('../../assets/images/search.png')} />
                    </View>
                    <Text className="text-gray-700 font-[ebold] text-lg tracking-wide">Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={async () => {
                        let data = await AppleLogin()

                        if (data) {
                            let userId = data?.user;

                            let givenName = data?.fullName?.givenName || '';
                            let familyName = data?.fullName?.familyName || '';
                            let displayName = `${givenName} ${familyName}`.trim();

                            let email = data?.email;

                            const payload = {
                                providerId: userId,
                                name: displayName || undefined,
                                email: email || undefined,
                                sex: sex || undefined,
                                dob: dob || undefined,
                                fast: fast ? parseFloat(fast) : undefined,
                                weight: weight ? parseFloat(weight) : undefined,
                                height: height ? parseFloat(height) : undefined,
                            };

                            const response = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/apple`, payload);
                            const result = response.data;

                            console.log('Apple Login สำเร็จ:', result);

                            if (result.statusCode === 201 || result.statusCode === 200) {
                                cookie.setItem("token", result.token)
                                navigate.replace("/personalized")
                            }
                        }
                    }}
                    className="w-full h-14 rounded-2xl bg-white border border-gray-200 flex-row justify-center items-center relative shadow-sm shadow-gray-100"
                >
                    <View className="absolute left-6 flex justify-center items-center">
                        <Image style={{ width: 24, height: 24 }} source={require('../../assets/images/apple-logo.png')} />
                    </View>
                    <Text className="text-gray-700 font-[ebold] text-lg tracking-wide">Continue with Apple</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Signin