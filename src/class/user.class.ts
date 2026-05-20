import axios from "axios"
import cookie from '@react-native-async-storage/async-storage'
import { public_url } from "../../config"

export class User {
    public getDaily = async (selectDay: string) => {

        let token = await cookie.getItem('token')

        console.log(token)

        let { data } = await axios.post(`${public_url}/api/daily`,{
            date: selectDay
        } ,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return data
    }
}