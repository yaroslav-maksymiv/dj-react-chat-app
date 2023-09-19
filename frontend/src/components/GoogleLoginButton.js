import axios from "axios"

const baseURL = process.env.REACT_APP_API_URL

export const GoogleLoginButton = ({ buttonText = 'Continue with Google' }) => {
    const handleGoogleAuthenticate = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/auth/o/google-oauth2/?redirect_uri=http://localhost:3000`)
            window.location.replace(res.data.authorization_url)
        } catch (error) {
            console.log('Error with google authentication')
        }
    }

    return (
        <div className="google-login-button" onClick={handleGoogleAuthenticate}>
            <img src={require('../assets/common/google-logo.png')} alt="google-logo" />
            {buttonText}
        </div>
    )
}