import axios from "axios"
import { CameraCapturedPicture } from 'expo-camera';
import { public_url } from "../../config";

export const analysis_food = async (image: CameraCapturedPicture, currentDate: string) => {

    let formData = new FormData()

    formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'photo.jpg'
    } as any)
    formData.append('currentDate', currentDate)

    // ✅ log ดูก่อน
    console.log("image.uri →", image.uri)
    console.log("image.width →", image.width)
    console.log("image.height →", image.height)

    console.log("SHOOT")

    let { data } = await axios.post(`${public_url}/api/food`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return data
}