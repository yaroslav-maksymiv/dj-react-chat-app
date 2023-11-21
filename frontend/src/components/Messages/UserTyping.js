export const UserTyping = ({userImage}) => {
    return (
        <div className="message typing-message">
            <img className="avatar-md"
                 src={userImage}
                 data-toggle="tooltip" data-placement="top"
                 title="Keith"
                 alt="avatar"/>
            <div className="text-main">
                <div className="text-group">
                    <div className="text typing">
                        <div className="wave">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
