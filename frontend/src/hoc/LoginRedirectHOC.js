import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export const LoginRedirectHOC = (Component) => {
    const navigate = useNavigate()

    const WrappedComponent = () => {
        const {userInfo} = useSelector(state => state.userLogin)

        if (!userInfo) {
            return navigate('login/')
        }

        return <Component/>
    }

    return WrappedComponent
}