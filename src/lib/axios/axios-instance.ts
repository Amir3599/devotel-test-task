import axios from 'axios'
import { API_BASE_URL } from '../../constants/app.constants'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use((config) => {
    return config
})

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
