import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import axios from 'axios'

import { updateUser } from '../../actions/userActions'

const baseUrl = process.env.REACT_APP_API_URL


export const AccountSettings = ({ visibleCategory, handleCategoryClick }) => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.userLogin)

    const [userData, setUserData] = useState({
        firstName: userInfo ? userInfo.first_name : '',
        lastName: userInfo ? userInfo.last_name : '',
        avatar: userInfo ? userInfo.profile_picture : null
    })

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleAvatarChange = (e) => {
        setUserData({
            ...userData,
            avatar: e.target.files[0]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('avatar', userData.avatar)
        formData.append('first_name', userData.firstName)
        formData.append('last_name', userData.lastName)

        await axios.post(`${baseUrl}/api/users/update/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }).then(response => {
            dispatch(updateUser(response.data))
        }).catch(error => {
            console.log('Error', error)
        })
    }

    return (
        <div class="category">
            <div onClick={() => handleCategoryClick('account')} class="title collapsed" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <i class="material-icons md-30 online">person_outline</i>
                <div class="data">
                    <h5>My Account</h5>
                    <p>Update your profile details</p>
                </div>
                <i class="material-icons">keyboard_arrow_right</i>
            </div>
            <div class={`collapse ${visibleCategory === 'account' ? 'show' : ''}`} id="collapseOne" aria-labelledby="headingOne" data-parent="#accordionSettings">
                <div class="content">
                    <div class="upload">
                        <div class="data">
                            <img class="avatar-xl" src={userData.avatar ? typeof userData.avatar === 'object' ? URL.createObjectURL(userData.avatar) : userData.avatar : require('../../assets/common/user.png')} alt="avatar" />
                            <label>
                                <input type="file" onChange={handleAvatarChange} />
                                <span class="btn button">Upload avatar</span>
                            </label>
                        </div>
                        <p>For best results, use an image at least 256px by 256px in either .jpg or .png format!</p>
                    </div>
                    <form>
                        <div class="field">
                            <label for="firstName">First name <span>*</span></label>
                            <input value={userData.firstName} onChange={e => handleChange(e)} name='firstName' type="text" class="form-control" id="firstName" placeholder="First name" required />
                        </div>
                        <div class="field">
                            <label for="lastName">Last name <span>*</span></label>
                            <input value={userData.lastName} onChange={e => handleChange(e)} name='lastName' type="text" class="form-control" id="lastName" placeholder="Last name" required />
                        </div>
                        {/* <button class="btn btn-link w-100">Delete Account</button> */}
                        <button onClick={e => handleSubmit(e)} type="submit" class="btn button w-100">Apply</button>
                    </form>
                </div>
            </div>
        </div>
    )
}