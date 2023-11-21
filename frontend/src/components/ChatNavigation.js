import {useSelector} from 'react-redux'

const baseUrl = process.env.REACT_APP_API_URL

export const ChatNavigation = ({}) => {

    const {error, loading, chat} = useSelector(state => state.chatSingle)

    return (
        <>
            {chat && (
                <div className="top">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="inside">
                                <img className="avatar-md"
                                     src={`${baseUrl}${chat.participants[0].user.profile_picture}`}
                                     data-toggle="tooltip" data-placement="top" title="Keith" alt="avatar"/>
                                {/* <div className="status">
                                    <i className="material-icons online">fiber_manual_record</i>
                                </div> */}
                                <div className="data">
                                    <h5>{chat.participants[0].user.full_name}</h5>
                                    <span>{chat.participants[0].user.email}</span>
                                </div>
                                <div className="dropdown">
                                    {/*<button className="btn" data-toggle="dropdown" aria-haspopup="true"*/}
                                    {/*        aria-expanded="false"><i className="material-icons md-30">more_vert</i>*/}
                                    {/*</button>*/}
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <button className="dropdown-item"><i className="material-icons">clear</i>Clear
                                            History
                                        </button>
                                        <button className="dropdown-item"><i className="material-icons">block</i>Block
                                            Contact
                                        </button>
                                        <button className="dropdown-item"><i className="material-icons">delete</i>Delete
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}