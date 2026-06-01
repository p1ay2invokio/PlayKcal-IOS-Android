import axios from "axios"
import cookie from '@react-native-async-storage/async-storage'
import { public_url } from "../../config"

export class User {

    public getUserData = async () => {
        let token = await cookie.getItem('token')

        console.log(token)

        let { data } = await axios.get(`${public_url}/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return data
    }

    public getDaily = async (selectDay: string) => {

        let token = await cookie.getItem('token')

        console.log(token)

        let { data } = await axios.post(`${public_url}/api/daily`, {
            date: selectDay
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return data
    }


    public updateWeight = async (new_weight: number, currentDate: string) => {
        let token = await cookie.getItem('token')
        let { data } = await axios.patch(`${public_url}/api/current-weight`,
            { new_weight, currentDate },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return data
    }


    public deleteAccount = async () => {
        let token = await cookie.getItem('token')

        console.log(`${public_url}/api/user`)

        let { data } = await axios.delete(`${public_url}/api/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return data
    }
}