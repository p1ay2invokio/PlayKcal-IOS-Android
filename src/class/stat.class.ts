import axios from "axios"
import { public_url } from "../../config"
import AsyncStorage from "@react-native-async-storage/async-storage"

export class Stat {
    public getStat = async (days: number) => {

        let token = await AsyncStorage.getItem('token')


        let { data } = await axios.get(`${public_url}/api/stat/${days}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log("EWW : ", data)

        return data
    }
}