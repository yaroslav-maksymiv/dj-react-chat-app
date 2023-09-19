import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const HomeScreen = () => {
    const navigate = useNavigate()

    const { userInfo } = useSelector(state => state.userLogin)

    useEffect(() => {

        if (!userInfo) {
            navigate('/login')
        }
    }, [userInfo])

    return (
        <>
            Home
        </>
    )
}