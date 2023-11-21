import { useSelector } from 'react-redux'
import { useState } from 'react'

import { AccountSettings } from './AccountSettings'

const baseUrl = process.env.REACT_APP_API_URL

export const Settings = () => {
    const { userInfo } = useSelector(state => state.userLogin)

    const [visibleCategory, setVisibleCategory] = useState(null)

    const handleCategoryClick = (category) => {
        if (!visibleCategory || visibleCategory !== category) {
            setVisibleCategory(category)
        } else {
            setVisibleCategory(null)
        }
    }

    return (
        <div className="tab-pane fade active show" id="settings">
            <div className="settings">
                <div className="profile">
                    <img className="avatar-xl" src={userInfo.profile_picture ? `${baseUrl}${userInfo.profile_picture}` : require('../../assets/common/user.png')} alt="avatar" />
                    <h1><div>{userInfo.first_name} {userInfo.last_name}</div></h1>
                    <h6><div>{userInfo.email}</div></h6>
                </div>
                <div className="categories" id="accordionSettings">
                    <h1>Settings</h1>
                    
                    <AccountSettings handleCategoryClick={handleCategoryClick} visibleCategory={visibleCategory} />
                </div>
            </div>
        </div>
    )
}