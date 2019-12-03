import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { setAxiosToken } from '../services/axiosPreset'
import { BoardContext } from '../contexts/BoardContext'
import { signUp } from '../actions/authActions'


const SignUp = () => {
    const { auth, authDispatch } = useContext(BoardContext)
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        setIsLoading(true)
        signUp({firstName, lastName, email, password})
            .then((res) => {
                setIsLoading(false)

                const tokenJSON = JSON.stringify(res.data.token)
                localStorage.setItem('TM_App_token', tokenJSON)

                setAxiosToken(res.data.token)

                authDispatch({
                    type: 'LOGIN',
                    token: res.data.token
                })               
            })
            .catch((e) => {
                console.log(e)
            })
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
    }

    if (auth.token) {
        return <Redirect to='/' />
    }

    if (isLoading) {
        return <div className="spinner"><span className="fas fa-spinner fa-5x fa-spin"></span></div>
    }
    return (  
        <div className="login-form-container">
            <h3 className="login-header">Sign Up</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        value={firstName}
                        className="login-input"
                        placeholder="First name *"
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        value={lastName}
                        className="login-input"
                        placeholder="Last name *"
                        required
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        value={email}
                        className="login-input" 
                        placeholder="email *"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <input 
                        type="password" 
                        value={password}
                        className="login-input"
                        placeholder="password *"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <button className="login-button">Sign Up</button>
                </div>
                <div className="input-wrapper">
                    <Link to='/signin'>
                        <span className="already">Already have an account? Click here to sign in.</span>
                    </Link>                    
                </div>
                
            </form>
        </div>
    );
}
 
export default SignUp;