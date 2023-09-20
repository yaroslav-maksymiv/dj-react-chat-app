import { UPDATE_USER } from '../constants/userConstants'

export const updateUser = (data) => dispatch => {
    dispatch({
        type: UPDATE_USER,
        payload: data
    })
}