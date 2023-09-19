import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useNavigate, Link, redirect  } from 'react-router-dom'
import validator from 'validator'

import { userRegister } from '../actions/authenticationActions'
import { GoogleLoginButton } from '../components/GoogleLoginButton'


export const RegisterScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isAuthenticated } = useSelector(state => state.userLogin)

    const [errorMessage, setErrorMessage] = useState('')
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password1: '',
        password2: ''
    })

    const validate = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 8
        })) {
            setErrorMessage('Is Strong Password')
        } else {
            setErrorMessage('Is Not Strong Password')
        }
    }

    const handleChange = (e) => {
        // if (e.target.name === 'password1') {
        //     validate(e.target.value)
        // }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validate(form.password1)
        if (form.password1 !== form.password2) {
            setErrorMessage('Passwords should match')
        } else {
            setErrorMessage('')
        }

        dispatch(userRegister(form.email, form.password1, form.firstName, form.lastName)).then(response => {
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
            <div class="main order-md-2">
                <div class="start">
                    <div class="container">
                        <div class="col-md-12">
                            <div class="content">
                                <h1>Create Account</h1>
                                <div class="third-party">
                                    <GoogleLoginButton />
                                </div>
                                <p>or use your email account:</p>
                                <form class="signup">
                                    <div class="form-parent">
                                        <div class="form-group">
                                            <input onChange={e => handleChange(e)} name='firstName' type="text" id="inputFirstName" class="form-control" placeholder="First Name" required />
                                            <button class="btn icon"><i class="material-icons">person_outline</i></button>
                                        </div>
                                        <div class="form-group">
                                            <input onChange={e => handleChange(e)} name='lastName' type="text" id="inputLastName" class="form-control" placeholder="Last Name" required />
                                            <button class="btn icon"><i class="material-icons">person_outline</i></button>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input onChange={e => handleChange(e)} name='email' type="email" id="inputEmail" class="form-control" placeholder="Email Address" required />
                                        <button class="btn icon"><i class="material-icons">mail_outline</i></button>
                                    </div>
                                    <div class="form-group">
                                        <input onChange={e => handleChange(e)} name='password1' type="password" id="inputPassword1" class="form-control" placeholder="Password" required />
                                        <button class="btn icon"><i class="material-icons">lock_outline</i></button>
                                    </div>
                                    <p>{errorMessage}</p>
                                    <div class="form-group">
                                        <input onChange={e => handleChange(e)} name='password2' type="password" id="inputPassword2" class="form-control" placeholder="Password repeat" required />
                                        <button class="btn icon"><i class="material-icons">lock_outline</i></button>
                                    </div>
                                    <button onClick={e => handleSubmit(e)} class="btn button">Sign Up</button>
                                    <div class="callout">
                                        <span>Already a member? <a href="sign-in.html">Sign In</a></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aside order-md-1">
                <div class="container">
                    <div class="col-md-12">
                        <div class="preference">
                            <h2>Welcome Back!</h2>
                            <p>To keep connected with your friends please login with your personal info.</p>
                            <Link to={'/login'} class="btn button">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}