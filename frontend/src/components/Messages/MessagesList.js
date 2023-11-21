import {useEffect, useState} from 'react'
import {Message} from "./Message"

const baseUrl = process.env.REACT_APP_API_URL

Date.prototype.getWeek = function() {
    const date = new Date(this)
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

const formatTimestamp = (timestamp) => {
    const currentDate = new Date()
    const messageDate = new Date(timestamp)

    const currentWeek = currentDate.getWeek()
    const messageWeek = messageDate.getWeek()

    if (currentDate.toDateString() === messageDate.toDateString()) {
        return 'Today'
    } else if (currentWeek === messageWeek) {
        return messageDate.toLocaleString('en-US', { weekday: 'long' })
    } else {
        const options = { day: 'numeric', month: 'short' }
        return messageDate.toLocaleDateString('en-US', options)
    }
}

export const MessagesList = ({messages, chat, userEmail}) => {
    const [messagesGroups, setMessagesGroups] = useState([])

    useEffect(() => {
        if (messages.length > 0) {
            const groupedMessages = []

            for (const message of messages) {
                let lastGroupMessage = groupedMessages[groupedMessages.length - 1]

                if (lastGroupMessage) {
                    const lastMessageDate = new Date(lastGroupMessage[0].timestamp)
                    const currentMessageDate = new Date(message.timestamp)
                    if (lastMessageDate.toDateString() !== currentMessageDate.toDateString()) {
                        groupedMessages.push({date: lastGroupMessage[0].timestamp})
                        groupedMessages.push([message])
                        continue
                    }
                }

                if (!lastGroupMessage || lastGroupMessage[0].sender !== message.sender) {
                    lastGroupMessage = [message]
                    groupedMessages.push(lastGroupMessage)
                } else {
                    lastGroupMessage.push(message)
                }
            }

            setMessagesGroups(groupedMessages)
        }
    }, [messages])

    const getMessageSenderPicture = (sender) => {
        const participant = chat.participants.find(participant => participant.user.email === sender)
        return participant ? participant.user.profile_picture : ''
    }

    return (
        <>
            {messagesGroups.map((group, index) => {
                if (group.date) {
                    return (
                        <div className="messages-date-divider">{formatTimestamp(group.date)}</div>
                    )
                }
                if (group[0].sender === userEmail) {
                    return (
                        <div key={index} className="message me">
                            <div className="text-main">
                                {group.map((message, messageIndex) => (
                                    <Message message={message} index={messageIndex} me={true}/>
                                ))}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} className="message">
                            <img
                                src={chat && `${baseUrl}${getMessageSenderPicture(group[0].sender)}`}
                                className="avatar-md" data-toggle="tooltip"
                                data-placement="top" title="Keith" alt="avatar"
                            />
                            <div className="text-main">
                                {group.map((message, messageIndex) => (
                                    <Message message={message} index={messageIndex} me={false}/>
                                ))}
                            </div>
                        </div>
                    )
                }
            })}
        </>
    )
}