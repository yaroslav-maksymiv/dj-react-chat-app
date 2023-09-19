import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux"
import { composeWithDevTools } from '@redux-devtools/extension'

import { loginReducer, registerReducer } from './reducers/authenticationReducers'

const reducers = combineReducers({
    userLogin: loginReducer,
    userRegister: registerReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
        isAuthenticated: userInfoFromStorage ? true : false
    },
}

const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
    composedEnhancers: composeWithDevTools()
})

export default store