console.log("ROOT INDEX RENDERED")

import { useCallback, useEffect, useState } from "react"
import { View } from "react-native"
import Dob from "../components/dob"
import Height from "../components/height"
import Weight from "../components/weight"
import { useMeasureStore } from "@/stores/measure.store"
import Sex from "../components/sex"
import Signin from "../components/signin"
import Fast from "../components/fast"
import { useFocusEffect, useRouter } from "expo-router"
import cookie from '@react-native-async-storage/async-storage'

const Register = () => {

    let { current } = useMeasureStore()

    let navigate = useRouter()

    return (
        <View className="flex-1">
            {current === 0 ? <Dob></Dob> : current == 1 ? <Sex></Sex> : current === 2 ? <Height></Height> : current === 3 ? <Weight></Weight> : current === 4 ? <Fast></Fast> : current === 5 ? <Signin></Signin> : null}
        </View>
    )
}

export default Register