import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'

import {userLogin} from '../actions/authenticationActions'
import {GoogleLoginButton} from '../components/GoogleLoginButton'


export const LoginScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {isAuthenticated} = useSelector(state => state.userLogin)

    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateForm = (form) => {
        if (form.email.length < 1) {
            return 'Email cannot be empty. Please enter your email.'
        } else if (!isEmailValid(form.email)) {
            return 'Invalid email format. Please enter a valid email address.'
        } else if (form.password.length < 1) {
            return 'Password cannot be empty. Please enter your password.'
        } else {
            return null
        }
    }

    const submitForm = () => {
        dispatch(userLogin(form.email, form.password)).then(response => {
            navigate('/')
        }).catch(e => {
            setMessage('Email or password is not correct!')
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validationMessage = validateForm(form)
        setMessage(validationMessage)

        if (!validationMessage) {
            submitForm()
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])

    return (
        <>
            <div className="main order-md-1">
                <div className="start">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="content">
                                <h1>Sign in to Swipe</h1>
                                <div style={{marginBottom: '0'}} className="third-party">
                                    {message && (
                                        <div style={{width: '366px'}} className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    )}
                                </div>
                                <div className="third-party third-party-login">
                                    <GoogleLoginButton/>
                                </div>
                                <p>or use your email account:</p>
                                <form>
                                    <div className="form-group">
                                        <input onChange={e => handleChange(e)} name='email' type="email" id="inputEmail"
                                               className="form-control" placeholder="Email Address"
                                               onKeyPress={handleKeyPress}
                                        />
                                        <button className="btn icon"><i className="material-icons">mail_outline</i>
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <input onChange={e => handleChange(e)} name='password' type="password"
                                               id="inputPassword" className="form-control" placeholder="Password"
                                               onKeyPress={handleKeyPress}
                                        />
                                        <button className="btn icon"><i className="material-icons">lock_outline</i>
                                        </button>
                                    </div>
                                    <button onClick={e => handleSubmit(e)} type="submit" className="btn button">Sign
                                        In
                                    </button>
                                    <div className="callout">
                                        <span>Don't have account? <Link to={"/register"}>Create Account</Link></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="aside order-md-2">
                <div className="container">
                    <div className="col-md-12">
                        <div className="preference">
                            <h2>Hello, Friend!</h2>
                            <p>Enter your personal details and start your journey with Swipe today.</p>
                            <Link to={'/register'} className="btn button">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}