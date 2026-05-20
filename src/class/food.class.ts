import axios from "axios"
import { public_url } from "../../config"

export class Food {
    public getFoodById = async (productId: number) => {
        let { data } = await axios.get(`${public_url}/api/food/${productId}`)
        return data
    }
}