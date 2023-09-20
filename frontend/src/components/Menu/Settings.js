import { useSelector } from 'react-redux'
import { useState } from 'react'

import { AccountSettings } from './AccountSettings'

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
        <div class="tab-pane fade active show" id="settings">
            <div class="settings">
                <div class="profile">
                    <img class="avatar-xl" src={userInfo.profile_picture ? userInfo.profile_picture : require('../../assets/common/user.png')} alt="avatar" />
                    <h1><div>{userInfo.first_name} {userInfo.last_name}</div></h1>
                    <div class="stats">
                        <div class="item">
                            <h2>122</h2>
                            <h3>Fellas</h3>
                        </div>
                        <div class="item">
                            <h2>305</h2>
                            <h3>Chats</h3>
                        </div>
                        <div class="item">
                            <h2>1538</h2>
                            <h3>Posts</h3>
                        </div>
                    </div>
                </div>
                <div class="categories" id="accordionSettings">
                    <h1>Settings</h1>
                    
                    <AccountSettings handleCategoryClick={handleCategoryClick} visibleCategory={visibleCategory} />
                </div>
            </div>
        </div>
    )
}