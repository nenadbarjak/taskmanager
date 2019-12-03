import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { setAxiosToken } from '../services/axiosPreset'
import { BoardContext } from '../contexts/BoardContext'
import { signIn } from '../actions/authActions'

const SignIn = () => {
    const { auth, authDispatch } = useContext(BoardContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()

        setIsLoading(true)
        signIn({ email, password })
            .then((res) => {
                
                const tokenJSON = JSON.stringify(res.data.token)
                localStorage.setItem('TM_App_token', tokenJSON)

                setAxiosToken(res.data.token)

                authDispatch({
                    type: 'LOGIN',
                    token: res.data.token,
                })
            })
            .catch((e) => {
                console.log(e)
                setIsLoading(false)
            })
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
            <h3 className="login-header">Sign In</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        value={email}
                        required
                        className="login-input" 
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <input 
                        type="password" 
                        value={password}
                        required
                        className="login-input"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <button className="login-button">Sign In</button>
                </div>
                <div className="input-wrapper">
                    <Link to='/signup'>
                        <span className="already">Don't have an account? Click here to sign up.</span>
                    </Link>                   
                </div>               
            </form>
        </div>
    );
}
 
export default SignIn;