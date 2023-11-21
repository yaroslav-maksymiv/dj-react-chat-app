import axios from 'axios'
import jwt_decode from "jwt-decode"

import store from './store'
import { logout } from './actions/authenticationActions'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
})


const isTokenExpired = (token) => {
    const decodedToken = jwt_decode(token)
    const currentTimestamp = Date.now() / 1000

    return decodedToken.exp < currentTimestamp
}


api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo')
        const accessToken = userInfo ? JSON.parse(userInfo).token : null
        
        if (config.headers.Authorization && isTokenExpired(accessToken)) {
            store.dispatch(logout())
            return Promise.reject(new Error('Token expired'))
        }

        return config
    },
    (error) => {
        console.log(error);
        return Promise.reject(error)
    }
)

export default api
