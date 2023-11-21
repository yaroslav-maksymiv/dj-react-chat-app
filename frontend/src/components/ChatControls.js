import {useState, useRef} from "react"
import {sendAudio} from "../actions/chatActions";

export const ChatControls = ({
                                 sendNewMessageText, setSendNewMessageText,
                                 handleSendMessage, handleFilesChosen,
                                 chatId, newChatFileMessage
                             }) => {
    const [microphonePermission, setMicrophonePermission] = useState(false)
    const [stream, setStream] = useState(null)
    const [recording, setRecording] = useState(false)
    const [audioChunks, setAudioChunks] = useState([])
    const mediaRecorderRef = useRef(null)

    const getMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            setStream(stream)
            setMicrophonePermission(true)
        } catch (error) {
            setMicrophonePermission(false)
            console.error("Microphone permission denied:", error)
        }
    }

    const startRecording = () => {
        if (microphonePermission) {
            console.log('start recording')
            mediaRecorderRef.current = new MediaRecorder(stream)
            mediaRecorderRef.current.start()
            setRecording(true)
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    console.log('yes yes yes')
                    setAudioChunks(prevState => [...prevState, e.data])
                }
            }
        }
    }

    const stopRecording = () => {
        if (recording) {
            mediaRecorderRef.current.stop()
            setRecording(false)

            const audioBlob = new Blob(audioChunks, {type: 'audio/wav'})

            sendAudio(chatId, audioBlob).then(response => {
                newChatFileMessage(response.data.messageId)
            })

            setAudioChunks([])

        }
    }

    const cancelRecording = () => {
        mediaRecorderRef.current.stop()
        setRecording(false)
        setAudioChunks([])
        console.log('recording cancelled')
    }

    return (<div className="container">
        <div className="col-md-12">
            <div className="bottom">
                <form className="position-relative w-100">
                    <textarea
                        onChange={(e) => setSendNewMessageText(e.target.value)}
                        value={sendNewMessageText}
                        className="form-control"
                        placeholder="Start typing for reply..."
                        rows="1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSendMessage(e)
                            }
                        }}
                    ></textarea>
                    <button onClick={(e) => handleSendMessage(e)} type="submit"
                            className="btn send"><i
                        className="material-icons">send</i>
                    </button>
                </form>
                {/*<div className="record-audio">*/}
                {/*    {!microphonePermission ? (*/}
                {/*        <span onClick={getMicrophonePermission} className="btn-my">*/}
                {/*            <i className="fa-solid fa-microphone-slash"></i>*/}
                {/*        </span>*/}
                {/*    ) : (<>*/}
                {/*        {recording ? (<span onClick={stopRecording} className="btn-my">*/}
                {/*            <i className="fa-solid fa-microphone"></i>*/}
                {/*            <div className="record-audio__indicator"></div>*/}
                {/*        </span>) : (<span onClick={startRecording} className="btn-my">*/}
                {/*            <i className="fa-solid fa-microphone"></i>*/}
                {/*         </span>)}*/}
                {/*    </>)}*/}
                {/*</div>*/}
                <label>
                    {!recording && (<>
                        <input
                            accept=".png, .jpg, .jpeg, .gif, .txt, .doc, .docx, .pdf, .mp3"
                            onChange={(e) => handleFilesChosen(e.target.files)}
                            type="file"/>
                        <span className="btn attach d-sm-block d-none"><i
                            className="material-icons">attach_file</i></span>
                    </>)}
                    {recording && (<span onClick={cancelRecording} className="btn-my btn-cancel">
                            <i className="fa-solid fa-xmark"></i>
                        </span>)}
                </label>
            </div>
        </div>
    </div>)
}