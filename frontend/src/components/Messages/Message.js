import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'

const baseUrl = process.env.REACT_APP_API_URL

export const Message = ({message, index, me}) => {

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const period = hours >= 12 ? 'PM' : 'AM'
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        return `${formattedHours}:${formattedMinutes} ${period}`
    }

    const convertSize = (sizeInBytes) => {
        if (sizeInBytes < 1024) {
            return sizeInBytes + ' Bytes'
        } else if (sizeInBytes < 1024 * 2) {
            return (sizeInBytes / 1024).toFixed(2) + 'KB'
        } else if (sizeInBytes < 1024 * 3) {
            return (sizeInBytes / 1024 * 2).toFixed(2) + 'MB'
        } else {
            return (sizeInBytes / (1024 * 3)).toFixed(2) + 'GB'
        }
    }

    const handleDownloadFile = (message) => {
        const a = document.createElement('a')
        a.href = message.file.url
        a.download = message.file.filename
        a.click()
    }

    const renderMessage = (message) => {
        switch (message.content_type) {
            case 'Text':
                return (
                    <p>{message.text}</p>
                )
            case 'Image':
                return (
                    <div className="image">
                        <img src={`${baseUrl}${message.image.url}`} alt="image"/>
                    </div>
                )
            case 'File':
                return (
                    <div className="attachment">
                        <button onClick={() => handleDownloadFile(message)} className="btn attach">
                            <i className="material-icons md-18">insert_drive_file</i>
                        </button>
                        <div className="file">
                            <h5>
                                <a href={message.file.url} download={message.file.filename}>{message.file.filename}</a>
                            </h5>
                            <span>{convertSize(message.file.size)} Document</span>
                        </div>
                    </div>
                )
            case 'Audio':
                return (
                    <div className="audio">
                        {!message.audio.filename.startsWith("blob_") && (
                            <div className="audio-main">
                                <div className="audio-name">{message.audio.filename}</div>
                                <a href={message.audio.url} download={message.audio.filename}><i
                                    className="fa-solid fa-download"></i></a>
                            </div>
                        )}
                        {/*<AudioPlayer*/}
                        {/*    src={`${baseUrl}${message.audio.url}`}*/}
                        {/*/>*/}
                        <ReactAudioPlayer
                            src={`${baseUrl}${message.audio.url}`}
                            controls
                            className="my-audio-player"
                        />
                    </div>
                )
        }
    }

    return (
        <div key={index} className='text-group-with-time'>
            <div className={`text-group ${me ? 'me' : ''}`}>
                <div className={`text ${me ? 'me' : ''}`}
                     style={{padding: message.content_type === 'Image' ? '0' : '16px'}}>
                    {renderMessage(message)}
                </div>
            </div>
            <span>{formatTimestamp(message.timestamp)}</span>
        </div>
    )
}
