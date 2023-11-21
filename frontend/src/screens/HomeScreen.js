import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {useEffect} from 'react'

export const HomeScreen = () => {
    const navigate = useNavigate()

    const {userInfo} = useSelector(state => state.userLogin)

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
    }, [userInfo])

    return (
        <div className='home'>
            <div className="main">
                <div className="chat">
                    <div className="content empty">
                        <div className="container">
                            <div className="col-md-12">
                                <div className="no-messages">
                                    <p>Select a chat to start communicating.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}