import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams, useBeforeUnload} from 'react-router-dom'

import {useWebSocket} from '../websocket'
import {useUpdateEffect} from '../hooks/use-updateEffect'
import {ChatNavigation} from '../components/ChatNavigation'
import {getChatSingle, sendAudio, sendFile, sendImage} from '../actions/chatActions'
import InfiniteScroll from "react-infinite-scroll-component";
import {useDebounce} from "../hooks/use-debounce";
import {MessagesList} from "../components/Messages/MessagesList";
import {UserTyping} from "../components/Messages/UserTyping";
import {ChatControls} from "../components/ChatControls";

const baseUrl = process.env.REACT_APP_API_URL

export const ChatScreen = () => {
    const dispatch = useDispatch()
    const {id} = useParams()

    const hiddenMessageRef = useRef(null)
    const contentRef = useRef(null)

    const [socket, setSocket] = useState(null)
    const [sendNewMessageText, setSendNewMessageText] = useState('')
    const sendNewMessageTextDebounce = useDebounce(sendNewMessageText, 600)
    const [messages, setMessages] = useState([])
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [unreadMessages, setUnreadMessages] = useState(0)
    const [userTyping, setUserTyping] = useState({})
    const messagesPerPage = 20

    const {userInfo} = useSelector(state => state.userLogin)
    const {error, loading, chat} = useSelector(state => state.chatSingle)

    const handleMessages = (messagesList) => {
        const byNewestMessages = messagesList
        if (messagesList.length === 0) {
            setHasMore(false)
        } else {
            if (!messages.includes(messagesList[0])) {
                setMessages(prevMessages => [...prevMessages, ...byNewestMessages])
            }
            if (messagesList.length < 20) {
                setHasMore(false)
            }
        }
    }

    const handleNewMessage = (message) => {
        if (userTyping.email === message.sender) {
            setUserTyping({})
        }
        setMessages(prevMessages => [message, ...prevMessages])
        setUnreadMessages(prevState => prevState + 1)
    }

    const handleUserTyping = (data) => {
        const object = {
            email: data.from.user.email,
            profile_picture: data.from.user.profile_picture,
            status: data.status,
            chatId: data.chatId
        }
        setUserTyping(object)
    }

    const {
        fetchMessages,
        newChatMessage,
        newChatFileMessage,
        userTyping: manageUserTyping
    } = useWebSocket(id, handleMessages, handleNewMessage, handleUserTyping, setSocket)

    useBeforeUnload(() => {
        console.log('before unload')
    })

    // check if user scrolled to top
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const scrollTop = contentRef.current.scrollTop
                if (scrollTop < -150) {
                    setShouldScrollToBottom(false)
                } else if (scrollTop <= 0) {
                    setShouldScrollToBottom(true)
                    setUnreadMessages(0)
                }
            }
        }
        if (contentRef.current) {
            contentRef.current.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (contentRef.current) {
                contentRef.current.removeEventListener('scroll', handleScroll)
            }
        }
    })

    useEffect(() => {
        setMessages([])
        setPage(1)
        setHasMore(true)
        setSendNewMessageText('')
        setShouldScrollToBottom(true)
        dispatch(getChatSingle(id))
    }, [id])

    useUpdateEffect(() => {
        if (socket && socket.readyState === 1 && messages.length === 0 && chat) {
            fetchMessages(userInfo.email, id, page, messagesPerPage)
        }
    }, [socket])

    useUpdateEffect(() => {
        if (sendNewMessageText.length === 0) {
            manageUserTyping(userInfo.email, false)
        } else {
            manageUserTyping(userInfo.email, true)
        }
    }, [sendNewMessageTextDebounce])

    const handleSendMessage = (e) => {
        e.preventDefault()
        const message = {
            from: userInfo.email, content: sendNewMessageText, chatId: id
        }
        newChatMessage(message)
        setSendNewMessageText('')
    }

    const handleFilesChosen = (files) => {
        const filesArray = Array.from(files)
        filesArray.forEach(file => {
            console.log(file.type, 'file')
            const fileType = file.type.split('/')[0]
            switch (fileType) {
                case 'image':
                    sendImage(id, file).then(response => {
                        newChatFileMessage(response.data.messageId)
                    })
                    break
                case 'text':
                    sendFile(id, file).then(response => {
                        newChatFileMessage(response.data.messageId)
                    })
                    break
                case 'audio':
                    sendAudio(id, file).then(response => {
                        newChatFileMessage(response.data.messageId)
                    })
                    break
                default:
                    sendFile(id, file).then(response => {
                        newChatFileMessage(response.data.messageId)
                    })
                    break
            }
        })
    }

    const fetchMoreData = () => {
        if (socket && socket.readyState === 1 && messages.length > 0) {
            setTimeout(() => {
                if (chat) {
                    fetchMessages(userInfo.email, id, page + 1, messagesPerPage)
                }
            }, 500)
            setPage(prev => prev + 1)
        }
    }

    return (<div className="main">
        <div className="tab-content" id="nav-tabContent">
            <div className="babble tab-pane fade active show" id="list-chat" role="tabpanel"
                 aria-labelledby="list-chat-list">
                <div className="chat" id="chat1">
                    {error ? (<div className="content empty">
                        <div className="container">
                            <div className="col-md-12">
                                <div className="no-messages">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>) : loading ? (<div></div>) : (<>
                        <ChatNavigation chat={chat}/>
                        <div
                            ref={contentRef}
                            className="content"
                            id="content"
                            style={{
                                overflowY: "auto", display: "flex", flexDirection: "column-reverse"
                            }}
                        >
                            {!shouldScrollToBottom && (<button
                                onClick={() => {
                                    hiddenMessageRef.current.scrollIntoView({behavior: 'smooth'})
                                    setUnreadMessages(0)
                                }}
                                className="btn scroll-top-bottom"
                            >
                                {unreadMessages > 0 &&
                                    <div className="count-new-messages">{unreadMessages}</div>}
                                <i className="fa-solid fa-chevron-down"></i>
                            </button>)}

                            <div className="container">
                                <div className="col-md-12">

                                    <InfiniteScroll
                                        dataLength={messages.length}
                                        next={() => fetchMoreData()}
                                        inverse={true}
                                        hasMore={hasMore}
                                        loader={<div style={{marginBottom: '100px'}} className="loader-container">
                                            <div className="spin-loader"></div>
                                        </div>}
                                        scrollableTarget="content"
                                        style={{display: 'flex', flexDirection: 'column-reverse'}}
                                    >
                                        <MessagesList messages={messages} chat={chat} userEmail={userInfo.email}/>
                                    </InfiniteScroll>

                                    {userTyping && userTyping.status && userTyping.email !== userInfo.email && userTyping.chatId === parseInt(id) && (
                                        <UserTyping userImage={`${baseUrl}${userTyping.profile_picture}`}/>
                                    )}

                                    <div ref={hiddenMessageRef} className="hidden-message"></div>
                                </div>
                            </div>
                        </div>

                        <ChatControls sendNewMessageText={sendNewMessageText}
                                      setSendNewMessageText={setSendNewMessageText}
                                      handleSendMessage={handleSendMessage} handleFilesChosen={handleFilesChosen}
                                      newChatFileMessage={newChatFileMessage} chatId={id}
                        />

                    </>)}
                </div>
            </div>
        </div>
    </div>)
}