import axios from "axios"

export const Api = () => {
    return axios.create({
        baseURL:'http://localhost:8087/api/v1'
    })
}