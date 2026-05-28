import axios from "axios"
import { public_url } from "../../config"

export class Excercise {
    public addEx = async (activity: string, duration: number, intensity: string, dailyLogId: number) => {
        let { data } = await axios.post(`${public_url}/api/exercise`, {
            activity: activity,
            duration: duration,
            intensity: intensity,
            dailyLogId: dailyLogId
        })
        return data
    }


    public addExManual = async (activity: string, kcal: number, dailyLogId: number) => {
        let { data } = await axios.post(`${public_url}/api/manual/exercise`, {
            activity: activity,
            kcal: kcal,
            dailyLogId: dailyLogId
        })
        return data
    }

    public getEx = async (id: number) => {
        let { data } = await axios.get(`${public_url}/api/exercise/${id}`)
        return data
    }


    public updateEx = async (id: number, activity: string, caloriesBurned: number) => {

        console.log(Number(id), activity, caloriesBurned)

        let { data } = await axios.patch(`${public_url}/api/exercise/${id}`, {
            activity: activity,
            caloriesBurned: caloriesBurned
        })
        return data
    }

    public deleteEx = async (id: number) => {
        let { data } = await axios.delete(`${public_url}/api/exercise/${id}`)
        return data
    }
}