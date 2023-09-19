import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { userLogin } from '../actions/authenticationActions'
import { GoogleLoginButton } from '../components/GoogleLoginButton'


export const LoginScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isAuthenticated } = useSelector(state => state.userLogin)

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(userLogin(form.email, form.password)).then(response => {
            navigate('/')
        })
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])

    return (
        <>
            <div class="main order-md-1">
                <div class="start">
                    <div class="container">
                        <div class="col-md-12">
                            <div class="content">
                                <h1>Sign in to Swipe</h1>
                                <div class="third-party third-party-login">
                                    <GoogleLoginButton />
                                </div>
                                <p>or use your email account:</p>
                                <form>
                                    <div class="form-group">
                                        <input onChange={e => handleChange(e)} name='email' type="email" id="inputEmail" class="form-control" placeholder="Email Address" required />
                                        <button class="btn icon"><i class="material-icons">mail_outline</i></button>
                                    </div>
                                    <div class="form-group">
                                        <input onChange={e => handleChange(e)} name='password' type="password" id="inputPassword" class="form-control" placeholder="Password" required />
                                        <button class="btn icon"><i class="material-icons">lock_outline</i></button>
                                    </div>
                                    <button onClick={e => handleSubmit(e)} type="submit" class="btn button">Sign In</button>
                                    <div class="callout">
                                        <span>Don't have account? <a href="sign-up.html">Create Account</a></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aside order-md-2">
                <div class="container">
                    <div class="col-md-12">
                        <div class="preference">
                            <h2>Hello, Friend!</h2>
                            <p>Enter your personal details and start your journey with Swipe today.</p>
                            <Link to={'/register'} class="btn button">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}