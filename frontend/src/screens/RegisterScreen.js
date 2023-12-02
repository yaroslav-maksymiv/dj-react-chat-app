import {useDispatch, useSelector} from 'react-redux'
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import {userLogin, userRegister} from '../actions/authenticationActions'
import {GoogleLoginButton} from '../components/GoogleLoginButton'


export const RegisterScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {isAuthenticated} = useSelector(state => state.userLogin)

    const [message, setMessage] = useState(null)
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password1: '',
        password2: ''
    })


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
        if (form.firstName.length < 1) {
            return 'First Name cannot be empty. Please enter your First Name.'
        }

        if (form.lastName.length < 1) {
            return 'Last Name cannot be empty. Please enter your Last Name.'
        }

        if (form.email.length < 1) {
            return 'Email cannot be empty. Please enter your email.'
        } else if (!isEmailValid(form.email)) {
            return 'Invalid email format. Please enter a valid email address.'
        }

        if (form.password1.length < 1) {
            return 'Password cannot be empty. Please enter your password.'
        } else if (form.password1.length < 8) {
            return 'Password should be at least 8 characters.'
        } else if (form.password1.length > 30) {
            return 'Password is too long.'
        }

        if (form.password2.length < 1) {
            return 'Password repeat cannot be empty. Please enter your password repeat.'
        }

        if (form.password1 !== form.password2) {
            return 'Passwords do not match. Please make sure the passwords match.'
        }

        return null
    }

    const submitForm = () => {
        dispatch(userRegister(form.email, form.password1, form.firstName, form.lastName))
            .then(response => {
                navigate('/')
            }).catch(e => {
                setMessage(e)
            }
        )
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
            <div className="main order-md-2">
                <div className="start">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="content">
                                <h1>Create Account</h1>
                                <div style={{marginBottom: '0'}} className="third-party">
                                    {message && (
                                        <div style={{width: '446px'}} className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    )}
                                </div>
                                <div className="third-party">
                                    <GoogleLoginButton/>
                                </div>
                                <p>or use your email account:</p>
                                <form className="signup">
                                    <div className="form-parent">
                                        <div className="form-group">
                                            <input onChange={e => handleChange(e)} name='firstName' type="text"
                                                   id="inputFirstName" className="form-control"
                                                   placeholder="First Name" onKeyPress={handleKeyPress}/>
                                            <button className="btn icon"><i
                                                className="material-icons">person_outline</i></button>
                                        </div>
                                        <div className="form-group">
                                            <input onChange={e => handleChange(e)} name='lastName' type="text"
                                                   id="inputLastName" className="form-control" placeholder="Last Name"
                                                   onKeyPress={handleKeyPress}/>
                                            <button className="btn icon"><i
                                                className="material-icons">person_outline</i></button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input onChange={e => handleChange(e)} name='email' type="email" id="inputEmail"
                                               className="form-control" placeholder="Email Address"
                                               onKeyPress={handleKeyPress}/>
                                        <button className="btn icon"><i className="material-icons">mail_outline</i>
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <input onChange={e => handleChange(e)} name='password1' type="password"
                                               id="inputPassword1" className="form-control" placeholder="Password"
                                               onKeyPress={handleKeyPress}/>
                                        <button className="btn icon"><i className="material-icons">lock_outline</i>
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <input onChange={e => handleChange(e)} name='password2' type="password"
                                               id="inputPassword2" className="form-control"
                                               placeholder="Password repeat" onKeyPress={handleKeyPress}/>
                                        <button className="btn icon"><i className="material-icons">lock_outline</i>
                                        </button>
                                    </div>
                                    <button onClick={e => handleSubmit(e)} className="btn button">Sign Up</button>
                                    <div className="callout">
                                        <span>Already a member? <Link to={'/login'}>Sign In</Link></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="aside order-md-1">
                <div className="container">
                    <div className="col-md-12">
                        <div className="preference">
                            <h2>Welcome Back!</h2>
                            <p>To keep connected with your friends please login with your personal info.</p>
                            <Link to={'/login'} className="btn button">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}