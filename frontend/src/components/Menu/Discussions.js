import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'

import {PopupStartChat} from '../StartChatPopup'
import {getChatList} from '../../actions/chatActions'
import {useWebSocketDiscussions} from '../../websocket'

const baseUrl = process.env.REACT_APP_API_URL

export const formatTimestamp = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)

    const timeDifference = now - messageTime
    const minute = 60 * 1000
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7

    if (timeDifference < minute) {
        return 'just now'
    } else if (timeDifference < hour) {
        const minutesAgo = Math.floor(timeDifference / minute)
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
    } else if (timeDifference < day) {
        const hoursAgo = Math.floor(timeDifference / hour)
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`
    } else if (timeDifference < 2 * day) {
        return '1 day ago'
    } else if (timeDifference < week) {
        const options = {weekday: 'short'}
        return messageTime.toLocaleDateString('en-US', options)
    } else if (messageTime.getFullYear() === now.getFullYear()) {
        const options = {month: 'short', day: 'numeric'}
        return messageTime.toLocaleDateString('en-US', options)
    } else {
        const options = {year: 'numeric', month: 'short', day: 'numeric'}
        return messageTime.toLocaleDateString('en-US', options)
    }
}

export const Discussions = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pathname = window.location.pathname
    const parts = pathname.split('/')
    const currentChatId = parseInt(parts[parts.length - 1])

    const {userInfo} = useSelector(state => state.userLogin)
    const {loading, error, chats: receivedChats} = useSelector(state => state.chatList)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [chats, setChats] = useState([])
    const [searchText, setSearchText] = useState('')

    const filteredChats = searchText.replace(/\s/g, '').length > 0
        ? chats.filter(
            chat => chat.participants[0].user.full_name.toLowerCase().includes(searchText.toLowerCase())
        )
        : chats

    const handleNewMessage = (message) => {
        if (message.sender !== userInfo.email) {
            setChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat.id === message.chat) {
                        return {
                            ...chat,
                            last_message: message,
                        }
                    }
                    return chat
                })

                const index = updatedChats.findIndex((chat) => chat.id === message.chat)
                if (index !== -1) {
                    const [matchingChat] = updatedChats.splice(index, 1)
                    updatedChats.unshift(matchingChat)
                }

                return updatedChats
            })
        }
    }

    const {socketRefs} = useWebSocketDiscussions(chats, handleNewMessage)

    const openModal = () => {
        setIsModalOpen(true)
    }

    useEffect(() => {
        dispatch(getChatList())
    }, [])

    useEffect(() => {
        setChats(receivedChats)
    }, [receivedChats])

    const truncateWord = (text) => {
        if (text.length > 61) {
            return text.slice(0, 59) + '...'
        }
        return text
    }

    const handleSearching = (e) => {
        setSearchText(e.target.value)
    }

    const handleChangeChat = (e, url) => {
        e.preventDefault()
        for (const socket in socketRefs) {
            if (socket == currentChatId) {
                const data = {
                    command: 'user_typing',
                    from: userInfo.email,
                    status: false,
                    chatId: currentChatId
                }
                try {
                    socketRefs[socket].send(JSON.stringify(data))
                } catch (err) {
                    console.log(err.message, '--> websocket error')
                }
                break
            }
        }
        navigate(url)
    }

    return (
        <div className="tab-pane fade active show" id="members">
            <div className="search">
                <form className="form-inline position-relative">
                    <input onChange={(e) => handleSearching(e)} value={searchText} type="search"
                           className="form-control" id="people"
                           placeholder="Search for conversations..." autoComplete="off"/>
                    <button type="button" className="btn btn-link loop"><i className="material-icons">search</i>
                    </button>
                </form>
                <button onClick={() => openModal()} className="btn create" data-toggle="modal"
                        data-target="#exampleModalCenter"><i className="material-icons">create</i></button>
            </div>

            <div className="discussions">
                <h1>Discussions</h1>
                {filteredChats && filteredChats.length === 0 && (
                    <div>No discussions</div>
                )}
                {
                    error
                        ? <>Error</>
                        : loading
                            ? (<div className="loader-container">
                                <div className="spin-loader"></div>
                            </div>)
                            : filteredChats && filteredChats.map(chat => {
                            if (chat.is_group_chat) {
                                return (
                                    <div></div>
                                )
                            } else {
                                const chat_user = chat.participants[0].user
                                return (
                                    <div key={chat.id} className="list-group" id="chats" role="tablist">

                                        <Link onClick={(e) => handleChangeChat(e, `/chat/${chat.id}`)} to={`/chat/${chat.id}`}
                                              className={`filterDiscussions all read single ${currentChatId === chat.id ? 'active' : ''}`}
                                              id="list-chat-list" data-toggle="list" role="tab">
                                            <img className="avatar-md" src={`${baseUrl}${chat_user.profile_picture}`}
                                                 data-toggle="tooltip" data-placement="top" title="Janette"
                                                 alt="avatar"/>
                                            <div className="data">
                                                <h5>{chat_user.full_name}</h5>
                                                <span>{chat.last_message.timestamp && formatTimestamp(chat.last_message.timestamp)}</span>

                                                {chat.last_message.content_type === 'Text' && (
                                                    <p>{truncateWord(chat.last_message.text)}</p>
                                                )}
                                                {chat.last_message.content_type === 'Image' && (
                                                    <p>Image: {truncateWord(chat.last_message.image.url.split('/').pop())}</p>
                                                )}
                                                {chat.last_message.content_type === 'File' && (
                                                    <p>File: {truncateWord(chat.last_message.file.url.split('/').pop())}</p>
                                                )}
                                                {chat.last_message.content_type === 'Audio' && (
                                                    <p>Audio: {truncateWord(chat.last_message.audio.url.split('/').pop())}</p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }
                        })
                }
            </div>

            <PopupStartChat isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

        </div>
    )
}