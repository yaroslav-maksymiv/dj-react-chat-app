import {useEffect, useState, useRef} from 'react'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL

export const useWebSocket = (chatUrl, messagesCallback, newMessageCallback, userTypingCallback, setSocket) => {
    const socketRef = useRef(null)
    const [isSocketOpen, setIsSocketOpen] = useState(false)
    const processedMessages = useRef(new Set())

    const createWebSocket = () => {
        const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`
        socketRef.current = new WebSocket(path)

        socketRef.current.onopen = () => {
            setIsSocketOpen(true)
            setSocket(socketRef.current)
        }

        socketRef.current.onmessage = (e) => {
            socketNewMessage(e.data)
        }

        socketRef.current.onerror = (e) => {
            console.log(e.message)
        }

        socketRef.current.onclose = () => {
            setIsSocketOpen(false)
            setTimeout(() => {
                createWebSocket()
            }, 1000)
        }
    }

    useEffect(() => {
        createWebSocket()

        return () => {
            socketRef.current.close()
        }
    }, [chatUrl])

    const socketNewMessage = (data) => {
        const parsedData = JSON.parse(data)
        const command = parsedData.command

        if (command === 'messages' && messagesCallback) {
            messagesCallback(parsedData.messages)
        }

        if (command === 'new_message' && newMessageCallback) {
            const messageId = parsedData.message.id
            if (!processedMessages.current.has(messageId)) {
                processedMessages.current.add(messageId)
                newMessageCallback(parsedData.message)
            }
        }

        if (command === 'user_typing' && userTypingCallback) {
            userTypingCallback(parsedData.data)
        }
    }

    const fetchMessages = (username, chatId, page, messagesPerPage) => {
        sendMessage({
            command: 'fetch_messages',
            username: username,
            chatId: chatId,
            page: page,
            messagesPerPage: messagesPerPage
        })
    }

    const newChatFileMessage = (messageId) => {
        sendMessage({
            command: 'new_file_message',
            messageId: messageId,
            chatId: chatUrl
        })
    }

    const newChatMessage = (message) => {
        sendMessage({
            command: 'new_message',
            from: message.from,
            text: message.content,
            chatId: message.chatId,
            contentType: 'Text'
        })
    }

    const userTyping = (email, status, chatId = null) => {
        sendMessage({
            command: 'user_typing',
            from: email,
            status: status,
            chatId: chatId ? chatId : chatUrl
        })
    }

    const sendMessage = (data) => {
        if (isSocketOpen) {
            try {
                socketRef.current.send(JSON.stringify(data))
            } catch (err) {
                console.log(err.message, '--> websocket error')
            }
        } else {
            console.log('WebSocket not open')
        }
    }

    return {
        socketRef,
        fetchMessages,
        newChatMessage,
        newChatFileMessage,
        userTyping
    }
}


export const useWebSocketDiscussions = (chats, newMessageCallback) => {
    const processedMessages = useRef(new Set())
    const socketRefs = useRef({})

    const createWebSocket = (chatUrl) => {
        const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`
        const socket = new WebSocket(path)

        socket.onopen = () => {
            socketRefs.current[chatUrl] = socket
        }

        socket.onmessage = (e) => {
            socketNewMessage(e.data)
        }

        socket.onerror = (e) => {
            console.log(e.message)
        }

        socket.onclose = () => {
            setTimeout(() => {
                createWebSocket(chatUrl)
            }, 1000)
        }
    }

    useEffect(() => {
        if (chats && chats.length > 0) {
            chats.forEach(chat => {
                if (!socketRefs.current[chat.id]) {
                    createWebSocket(chat.id)
                }
            })
        }
    }, [chats])

    const socketNewMessage = (data) => {
        const parsedData = JSON.parse(data)
        const command = parsedData.command

        if (command === 'new_message' && newMessageCallback) {
            const messageId = parsedData.message.id
            if (!processedMessages.current.has(messageId)) {
                processedMessages.current.add(messageId)
                newMessageCallback(parsedData.message)
            }
        }
    }

    return {
        socketRefs: socketRefs.current
    }
}



