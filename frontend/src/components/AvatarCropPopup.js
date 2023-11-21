import AvatarEdit from 'react-avatar-edit'
import {useState} from "react";

export const AvatarCropPopup = ({isModalOpen, setIsModalOpen, setUserData}) => {
    const [croppedImage, setCroppedImage] = useState(null)

    const closeModal = (e) => {
        if (e.target.id === 'avatarCropModal' || e.target.id === 'closeAvatarCropModal') {
            setIsModalOpen(false)
            setCroppedImage(null)
        }
    }

    const saveCroppedImage = () => {
        setUserData(prevUserData => {
            return {
                ...prevUserData,
                avatar: croppedImage
            }
        })
        setIsModalOpen(false)
    }

    return (
        <div
            className={`modal fade ${isModalOpen ? 'show show-popup' : ''}`}
            id="avatarCropModal"
            role="dialog"
            onClick={(e) => closeModal(e)}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="requests">
                    <div className="title">
                        <h1 style={{paddingBottom: '0'}}>Upload your avatar</h1>
                        <button onClick={(e) => closeModal(e)} type="button" className="btn" data-dismiss="modal"
                                aria-label="Close"><i id='closeAvatarCropModal' className="material-icons">close</i>
                        </button>
                    </div>
                    <div className="content">
                        <div className="avatar-edit-content">
                            <AvatarEdit
                                width={200}
                                height={200}
                                imageWidth={370}
                                minCropRadius={60}
                                onCrop={(croppedImage) => setCroppedImage(croppedImage)}
                            />
                        </div>
                        <button onClick={saveCroppedImage} style={{marginTop: '20px'}} className="btn button w-100">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}