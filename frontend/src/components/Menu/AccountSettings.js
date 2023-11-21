import {useSelector, useDispatch} from 'react-redux'
import {useState} from 'react'
import axios from 'axios'

import {updateUser} from '../../actions/userActions'
import {AvatarCropPopup} from "../AvatarCropPopup";

const baseUrl = process.env.REACT_APP_API_URL

export const AccountSettings = ({visibleCategory, handleCategoryClick}) => {
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)

    const [userData, setUserData] = useState({
        firstName: userInfo ? userInfo.first_name : '',
        lastName: userInfo ? userInfo.last_name : '',
        avatar: userInfo ? userInfo.profile_picture : null
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleAvatarChange = (e) => {
        setIsModalOpen(true)
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
        <>
            <div className="category">
                <div onClick={() => handleCategoryClick('account')} className="title collapsed" id="headingOne"
                     data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <i className="material-icons md-30 online">person_outline</i>
                    <div className="data">
                        <h5>My Account</h5>
                        <p>Update your profile details</p>
                    </div>
                    <i className="material-icons">keyboard_arrow_right</i>
                </div>
                <div className={`collapse ${visibleCategory === 'account' ? 'show' : ''}`} id="collapseOne"
                     aria-labelledby="headingOne" data-parent="#accordionSettings">
                    <div className="content">
                        <div className="upload">
                            <div className="data">
                                <img className="avatar-xl"
                                     src={userData.avatar.startsWith('data:image/') ? userData.avatar : `${baseUrl}${userData.avatar}`}
                                     alt="avatar"/>
                                <label>
                                    <span onClick={handleAvatarChange} className="btn button">Upload avatar</span>
                                </label>
                            </div>
                            <p>For best results, use an image at least 256px by 256px in either .jpg or .png format!</p>
                        </div>
                        <form>
                            <div className="field">
                                <label htmlFor="firstName">First name <span>*</span></label>
                                <input value={userData.firstName} onChange={e => handleChange(e)} name='firstName'
                                       type="text" className="form-control" id="firstName" placeholder="First name"
                                       required/>
                            </div>
                            <div className="field">
                                <label htmlFor="lastName">Last name <span>*</span></label>
                                <input value={userData.lastName} onChange={e => handleChange(e)} name='lastName'
                                       type="text"
                                       className="form-control" id="lastName" placeholder="Last name" required/>
                            </div>
                            <button onClick={e => handleSubmit(e)} type="submit" className="btn button w-100">Apply
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <AvatarCropPopup isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setUserData={setUserData}/>
        </>

    )
}