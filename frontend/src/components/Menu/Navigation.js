import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../actions/authenticationActions'


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
        <div class="navigation">
            <div class="container">
                <div class="inside">
                    <div class="nav nav-tab menu">
                        <button class="btn"><img class="avatar-xl" src={userInfo.profile_picture ? userInfo.profile_picture : require('../../assets/common/user.png')} alt="avatar" /></button>
                        <a onClick={e => handleChangeTab(e, 'Discussions')} href="#discussions" data-toggle="tab" class="active"><i class={`material-icons ${activeTab === 'Discussions' ? 'active' : ''}`}>chat_bubble_outline</i></a>
                        <a onClick={e => handleChangeTab(e, 'Notifications')} href="#notifications" data-toggle="tab" class="f-grow1"><i class={`material-icons ${activeTab === 'Notifications' ? 'active' : ''}`}>notifications_none</i></a>
                        <a onClick={e => handleChangeTab(e, 'Settings')} href="#settings" data-toggle="tab"><i class={`material-icons ${activeTab === 'Settings' ? 'active' : ''}`}>settings</i></a>
                        <button onClick={handleLogout} class="btn power"><i class="material-icons">power_settings_new</i></button>
                    </div>
                </div>
            </div>
        </div>
    )
}