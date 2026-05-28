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

    let {current, setCurrent} = useMeasureStore()

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

            <TouchableOpacity className="absolute top-15 left-5 p-2" onPress={() => setCurrent(weight ? current - 1 : 0)}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

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

                if (data.statusCode === 201 || data.statusCode === 200) {
                    cookie.setItem("token", data.token)
                    navigate.replace("/personalized")
                }

            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50px] rounded-xl bg-green-600 flex justify-between px-14 items-center">
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/line.png')} />

                <Text className="text-white font-[ebold] text-xl">Continue with LINE</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
                const data = await GoogleLogin();

                if (data.type === 'success') {
                    const user = data.data.user;

                    // รวมข้อมูลจาก Google และข้อมูลสัดส่วน/เป้าหมายจาก Store
                    const payload = {
                        provider: 'google',
                        providerId: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.photo,

                        // ข้อมูลเพิ่มเติมจาก useMeasureStore
                        sex: sex || null,
                        dob: dob || null,
                        fast: fast ? parseFloat(fast) : null, // แปลงเป็น Float หากใน Store เป็น String
                        weight: weight ? parseFloat(weight) : null, // แปลงเป็น Float
                        height: height ? parseFloat(height) : null, // แปลงเป็น Float
                        goal: goal || null,
                        targetWeight: targetWeight ? parseInt(targetWeight) : null, // แปลงเป็น Int
                    };

                    // อย่าลืม import axios ด้านบนของไฟล์ด้วยนะครับ
                    // import axios from 'axios';

                    try {
                        // axios.post(URL, data) ส่ง payload ไปได้เลย ไม่ต้อง stringify
                        const response = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/google`, payload);

                        // ข้อมูลที่ Server ส่งกลับมาจะอยู่ใน response.data อัตโนมัติ
                        const result = response.data;

                        console.log('บันทึกข้อมูลและเข้าสู่ระบบสำเร็จ:', result);

                        if (result.statusCode === 201 || result.statusCode === 200) {
                            cookie.setItem("token", result.token)
                            navigate.replace("/personalized")
                        }



                        // console.log(response); // response ของ axios จะมี detail เยอะมาก (status, headers, config, data)
                        // router.replace('/personalized')

                    } catch (error: any) {
                        // axios จะโยนมาเข้า catch ทันทีถ้า Server ตอบกลับด้วย Status 4xx หรือ 5xx
                        if (error.response) {
                            // Server ตอบกลับมาแล้ว แต่เป็น Error (เช่น 400 Bad Request, 500 Internal Server Error)
                            console.error('เกิดข้อผิดพลาดจาก Server:', error.response.data);
                        } else if (error.request) {
                            // ส่ง Request ไปแล้ว แต่ไม่ได้รับการตอบกลับเลย (เช่น Server ล่ม, เน็ตหลุด)
                            console.error('ไม่สามารถเชื่อมต่อกับ Server ได้:', error.request);
                        } else {
                            // เกิด Error อื่นๆ ก่อนที่จะส่ง Request ได้สำเร็จ
                            console.error('ตั้งค่า Request ผิดพลาด:', error.message);
                        }
                    }
                }


            }} activeOpacity={0.7} className="w-[80%] flex-row gap-5 h-[50] rounded-xl border border-gray-300 flex justify-between px-14 items-center">
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/images/search.png')} />

                <Text className="text-gray-700 font-[ebold] text-xl">Continue with Google</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={async () => {
                let data = await AppleLogin()


                if (data) {
                    let userId = data?.user;

                    // รวมชื่อและนามสกุล (ถ้ามี)
                    let givenName = data?.fullName?.givenName || '';
                    let familyName = data?.fullName?.familyName || '';
                    let displayName = `${givenName} ${familyName}`.trim();

                    let email = data?.email;

                    // สร้าง Payload
                    const payload = {
                        providerId: userId,
                        name: displayName || undefined, // ถ้าไม่มีให้เป็น undefined
                        email: email || undefined,      // ถ้าไม่มีให้เป็น undefined

                        // ข้อมูลจาก Store
                        sex: sex || undefined,
                        dob: dob || undefined,
                        fast: fast ? parseFloat(fast) : undefined,
                        weight: weight ? parseFloat(weight) : undefined,
                        height: height ? parseFloat(height) : undefined,
                        goal: goal || undefined,
                        targetWeight: targetWeight ? parseInt(targetWeight) : undefined,
                    };

                    // ส่งไปที่ Backend ด้วย axios
                    const response = await axios.post(`${process.env.EXPO_PUBLIC_URI}/auth/apple`, payload);
                    const result = response.data;

                    console.log('Apple Login สำเร็จ:', result);


                    if (result.statusCode === 201 || result.statusCode === 200) {
                        cookie.setItem("token", result.token)
                        navigate.replace("/personalized")
                    }

                    // ไปหน้าต่อไป และเก็บ Token
                    // const token = result.token;
                    // router.replace('/personalized');
                }


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