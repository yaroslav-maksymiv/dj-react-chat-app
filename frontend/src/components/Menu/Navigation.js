import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../actions/authenticationActions'

const baseUrl = process.env.REACT_APP_API_URL


export const Navigation = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.userLogin)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const handleChangeTab = (e, tabName) => {
        e.preventDefault()
        setActiveTab(tabName)
    }

    return (
        <div className="navigation">
            <div className="container">
                <div className="inside">
                    <div className="nav nav-tab menu">
                        <button className="btn"><img className="avatar-xl" src={`${baseUrl}${userInfo.profile_picture}`} alt="avatar" /></button>
                        <a onClick={e => handleChangeTab(e, 'Discussions')} href="#discussions" data-toggle="tab" className="active f-grow1"><i className={`material-icons ${activeTab === 'Discussions' ? 'active' : ''}`}>chat_bubble_outline</i></a>
                        {/*<a onClick={e => handleChangeTab(e, 'Notifications')} href="#notifications" data-toggle="tab" className="f-grow1"><i className={`material-icons ${activeTab === 'Notifications' ? 'active' : ''}`}>notifications_none</i></a>*/}
                        <a onClick={e => handleChangeTab(e, 'Settings')} href="#settings" data-toggle="tab"><i className={`material-icons ${activeTab === 'Settings' ? 'active' : ''}`}>settings</i></a>
                        <button onClick={handleLogout} className="btn power"><i className="material-icons">power_settings_new</i></button>
                    </div>
                </div>
            </div>
        </div>
    )
}