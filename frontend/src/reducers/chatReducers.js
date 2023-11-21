import {
    CHATS_LIST_REQUEST,
    CHATS_LIST_SUCCESS,
    CHATS_LIST_FAIL,
    CHAT_CREATE_REQUEST,
    CHAT_CREATE_SUCCESS,
    CHAT_CREATE_FAIL,
    CHAT_SINGLE_REQUEST,
    CHAT_SINGLE_SUCCESS,
    CHAT_SINGLE_FAIL,
} from '../constants/chatConstans'


export const createChatReducer = (state = { chat: {} }, action) => {
    switch (action.type) {
        case CHAT_CREATE_REQUEST:
            return { loading: true }
        case CHAT_CREATE_SUCCESS:
            return { loading: false, chat: action.payload }
        case CHAT_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const chatListReducer = (state = { chats: [] }, action) => {
    switch (action.type) {
        case CHATS_LIST_REQUEST:
            return { loading: true }
        case CHATS_LIST_SUCCESS:
            return { loading: false, chats: action.payload }
        case CHATS_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const chatSingleReducer = (state = {}, action) => {
    switch (action.type) {
        case CHAT_SINGLE_REQUEST:
            return { loading: true }
        case CHAT_SINGLE_SUCCESS:
            return { loading: false, chat: action.payload }
        case CHAT_SINGLE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}