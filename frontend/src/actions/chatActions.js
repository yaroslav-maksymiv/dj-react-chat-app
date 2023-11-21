import {
    CHAT_CREATE_FAIL,
    CHAT_CREATE_REQUEST,
    CHAT_CREATE_SUCCESS,
    CHAT_SINGLE_FAIL,
    CHAT_SINGLE_REQUEST,
    CHAT_SINGLE_SUCCESS,
    CHATS_LIST_FAIL,
    CHATS_LIST_REQUEST,
    CHATS_LIST_SUCCESS,
} from '../constants/chatConstans'

import api from '../axiosConfig'


export const sendAudio = async (chatId, audio) => {
    try {
        const formData = new FormData()
        formData.append('audio', audio)
        formData.append('chatId', chatId)

        const userToken = JSON.parse(localStorage.getItem('userInfo')).token

        return await api.post(`/api/chat/upload-message/audio/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userToken}`
            }
        })
    } catch (error) {
        return error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
    }
}



export const sendFile = async (chatId, file) => {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chatId', chatId)

        const userToken = JSON.parse(localStorage.getItem('userInfo')).token

        return await api.post(`/api/chat/upload-message/file/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userToken}`
            }
        })
    } catch (error) {
        return error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
    }
}

export const sendImage = async (chatId, image) => {
    try {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('chatId', chatId)

        const userToken = JSON.parse(localStorage.getItem('userInfo')).token

        return await api.post(`/api/chat/upload-message/image/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userToken}`
            }
        })
    } catch (error) {
        return error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
    }
}

export const createNewChat = (participants, callbackFunction) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_CREATE_REQUEST
        })

        const {userInfo} = getState().userLogin

        const data = {
            participants: participants,
            is_group_chat: false,
            title: 'Chat Title',
        }

        const response = await api.post(`/api/chat/create/`, data, {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json'
            }
        })

        dispatch({
            type: CHAT_CREATE_SUCCESS,
            payload: response.data
        })
        callbackFunction({type: 'Success', data: response.data})
    } catch (error) {
        const errorText = error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        dispatch({
            type: CHAT_CREATE_FAIL,
            payload: errorText
        })
        callbackFunction({type: 'Error', data: errorText})
    }
}


export const getChatSingle = (chatId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_SINGLE_REQUEST
        })

        const {userInfo} = getState().userLogin

        const response = await api.get(`/api/chat/${chatId}/`, {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`
            }
        })

        dispatch({
            type: CHAT_SINGLE_SUCCESS,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: CHAT_SINGLE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}


export const getChatList = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHATS_LIST_REQUEST
        })

        const {userInfo} = getState().userLogin

        const response = await api.get(`/api/chat/`, {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`
            }
        })

        dispatch({
            type: CHATS_LIST_SUCCESS,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: CHATS_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}