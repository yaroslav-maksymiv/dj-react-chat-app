import {
    LOGIN_REQUEST,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_REQUEST,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    LOGOUT
} from '../constants/authenticationConstants'
import {UPDATE_USER} from '../constants/userConstants'

const initialState = {
    userInfo: {},
    loading: true,
    error: false,
    isAuthenticated: false
}


export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {loading: true}
        case LOGIN_SUCCESS:
            return {loading: false, isAuthenticated: true, userInfo: action.payload}
        case LOGIN_FAIL:
            return {loading: false, error: action.payload}
        case UPDATE_USER:
            const newUserInfo = {
                token: state.userInfo.token,
                ...action.payload
            }
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
            return {
                ...state,
                userInfo: newUserInfo
            }
        case GOOGLE_AUTH_SUCCESS:
            localStorage.setItem('access', action.payload.access)
            return {
                ...state,
                access: action.payload.access,
                refresh: action.payload.refresh
            }
        case GOOGLE_AUTH_FAIL:
        case LOGOUT:
            localStorage.removeItem('userInfo')
            localStorage.removeItem('access')
            return {}
        default:
            return state
    }
}


export const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
            return {loading: true}
        case REGISTER_SUCCESS:
            return {loading: false, userInfo: action.payload, isAuthnticated: true}
        case REGISTER_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}
