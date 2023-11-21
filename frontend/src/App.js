import {Routes, Route} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import queryString from 'query-string'
import {useEffect, createContext, useState} from 'react'

import {LoginScreen} from './screens/LoginScreen'
import {RegisterScreen} from './screens/RegisterScreen'
import {Menu} from './components/Menu/Menu'
import {ChatScreen} from './screens/ChatScreen'
import {HomeScreen} from './screens/HomeScreen'
import {googleAuthenticate} from './actions/authenticationActions'

const App = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const {isAuthenticated} = useSelector(state => state.userLogin)

    useEffect(() => {
        const values = queryString.parse(location.search)
        const state = values.state ? values.state : null
        const code = values.code ? values.code : null
        if (state && code) {
            dispatch(googleAuthenticate(state, code))
        }
    }, [location])

    return (
        <main>

            <div className="layout">
                {isAuthenticated && (
                    <>
                        <Menu/>
                    </>
                )}
                <Routes>
                    <Route path='/' element={<HomeScreen/>}/>
                    <Route path='/chat/:id' element={<ChatScreen/>}/>
                    <Route path='/login' element={<LoginScreen/>}/>
                    <Route path='/register' element={<RegisterScreen/>}/>
                </Routes>
            </div>

        </main>
    )
}

export default App