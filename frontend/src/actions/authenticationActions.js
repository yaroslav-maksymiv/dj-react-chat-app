import {
    LOGIN_REQUEST,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_REQUEST,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGOUT,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL
} from '../constants/authenticationConstants'

import axios from 'axios'

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const baseUrl = process.env.REACT_APP_API_URL


export const getUser = (token) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        })

        const response = await axios.get(`${baseUrl}/api/users/me/`, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        })

        const data = { ...response.data, 'token': token }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}


export const googleAuthenticate = (state, code) => async (dispatch) => {
    if (state && code) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const details = {
            'state': state,
            'code': code
        }
        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&')
        try {
            const response = await axios.post(`${baseUrl}/api/auth/o/google-oauth2/?${formBody}`, config)

            dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: response.data
            })
            // dispatch(getUser(response.data.access))
        } catch (error) {
            console.log(error)
            console.log(`${baseUrl}/api/auth/o/google-oauth2/?${formBody}`);
            dispatch({
                type: GOOGLE_AUTH_FAIL
            })
        }
    }
}


export const userRegister = (email, password, firstName, lastName) => async (dispatch) => {
    try {
        dispatch({
            type: REGISTER_REQUEST
        })

        const request_data = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        }

        const { data } = await axios.post(baseUrl + '/api/users/register/', request_data, config)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: data
        })
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))
        return data
    } catch (error) {
        console.log(error);
        dispatch({
            type: REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}


export const userLogin = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        })

        const request_data = {
            email: email,
            password: password,
        }

        const { data } = await axios.post(baseUrl + '/api/users/login/', request_data, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
        return data
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}


export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}