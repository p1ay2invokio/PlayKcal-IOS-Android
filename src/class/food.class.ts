import axios from "axios"
import { public_url } from "../../config"

export class Food {
    public getFoodById = async (productId: number) => {
        let { data } = await axios.get(`${public_url}/api/food/${productId}`)
        return data
    }

    public deleteFood = async (productId: number) => {
        let { data } = await axios.delete(`${public_url}/api/food/${productId}`)
        return data
    }

    public updateFood = async (productId: number, name: string, portion: number, kcal: number, protein: number, carbs: number, fat: number) => {
        console.log(`${public_url}/api/food/${productId}`)
        let { data } = await axios.patch(`${public_url}/api/food/${productId}`, {
            name: name,
            cal: kcal,
            protein: protein,
            carbs: carbs,
            fat: fat,
            qty: portion
        })
        return data
    }
}