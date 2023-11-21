import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from "react-router-dom"

import {useDebounce} from '../hooks/use-debounce'
import {useUpdateEffect} from '../hooks/use-updateEffect'
import {createNewChat, getChatList} from '../actions/chatActions'

import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

export const PopupStartChat = ({isModalOpen, setIsModalOpen}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {userInfo} = useSelector(state => state.userLogin)
    const [userEmail, setUserEmail] = useState('')
    const [user, setUser] = useState(null)
    const [possibleUsers, setPossibleUsers] = useState([])
    const [message, setMessage] = useState(null)
    const debounce = useDebounce(userEmail, 1000)

    const getUser = async (email) => {
        return await axios.get(`${baseUrl}/api/users/me/?email=${email}`)
    }

    const searchUser = async (email) => {
        const userToken = JSON.parse(localStorage.getItem('userInfo')).token
        return await axios.get(`${baseUrl}/api/users/search/?email=${email}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
    }

    useUpdateEffect(() => {
        if (userEmail.length > 0) {
            searchUser(userEmail).then(response => {
                setPossibleUsers(response.data)
            })
            getUser(userEmail).then(response => {
                setUser(response.data)
                setPossibleUsers([])
            }).catch(error => {
                setUser(false)
            })
        } else {
            setPossibleUsers([])
        }
    }, [debounce])

    const closeModal = (e) => {
        if (e.target.id === 'startChatModal' || e.target.id === 'closeStartChatModal') {
            setIsModalOpen(false)
            setPossibleUsers([])
            setUser(null)
            setUserEmail('')
            setMessage(null)
        }
    }

    const removeSelectedUser = () => {
        setUser(null)
        setUserEmail('')
    }

    const handleUserChange = (e) => {
        if (user) {
            setUser(null)
        } else {
            setUserEmail(e.target.value)
        }
    }

    const handleStartChat = (e) => {
        e.preventDefault()
        const participants = [userInfo.email, user.email]
        dispatch(createNewChat(participants, value => {
            if (value.type === 'Error') {
                setMessage(value.data)
            } else if (value.type === 'Success') {
                dispatch(getChatList())
                navigate(`/chat/${value.data.id}`)
                setIsModalOpen(false)
                setUser(null)
            }
        }))
    }

    const handleSelectUser = (user) => {
        setUser(user)
        setPossibleUsers([])
    }

    return (
        <div
            className={`modal fade ${isModalOpen ? 'show show-popup' : ''}`}
            id="startChatModal"
            role="dialog"
            onClick={(e) => closeModal(e)}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="requests">
                    <div className="title">
                        <h1>Start new chat</h1>
                        <button onClick={(e) => closeModal(e)} type="button" className="btn" data-dismiss="modal"
                                aria-label="Close"><i id='closeStartChatModal' className="material-icons">close</i>
                        </button>
                    </div>
                    <div className="content">
                        {message && (
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        )}

                        <form>
                            <div style={{marginBottom: '16px'}} className="form-group">
                                <label for="user">User email:</label>
                                <input onChange={handleUserChange} value={userEmail} type="text" autoComplete="off"
                                       className="form-control" id="user" placeholder="Add recipient..." required/>
                                {
                                    user && (
                                        <div className="user" id="contact">
                                            <img className="avatar-sm" src={`${baseUrl}${user.profile_picture}`}
                                                 alt="avatar"/>
                                            <h5>{user.first_name} {user.last_name}</h5>
                                            <button onClick={removeSelectedUser} className="btn"><i
                                                className="material-icons">close</i></button>
                                        </div>
                                    )
                                }
                                {possibleUsers && possibleUsers.length > 0 && !user && (
                                    <div className="user-recommendations">
                                        {possibleUsers.map(user => (
                                            <div onClick={() => handleSelectUser(user)} className="user-recommendations__item">
                                                <div className="user user-recommendations__user">
                                                    <img className="avatar-sm" src={`${baseUrl}${user.profile_picture}`}
                                                         alt="avatar"/>
                                                    <h5>{user.first_name} {user.last_name}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={(e) => handleStartChat(e)} type="submit" className="btn button w-100">Start
                                Chatting
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}