import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Analytics } from '../../analytics';
import { STATUS } from '../location';
import './index.css';

const Login = ({ setStatus }) => {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const signIn = async () => {
        Analytics.record({name: 'Login'})
        try {
            setMessage('')
            const user = await Auth.signIn('mrsclaus', password)
            if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
                setStatus(STATUS.NOT_LOGGED_IN)
                setMessage(<span>Password reset required. Please update the account password before logging in. <a href="/reset-password">Reset password</a></span>)
                return;
            }
            await Auth.currentAuthenticatedUser({ bypassCache: true })
            setStatus(STATUS.LOGGED_IN)
        } catch (ex) {
            console.error(ex)
            setStatus(STATUS.NOT_LOGGED_IN)
            if(ex.toString().indexOf('Incorrect username or password') > -1) {
                setMessage('Incorrect password.')
            } else if (ex?.message) {
                setMessage(ex.message)
            } else {
                setMessage('Authentication failed. Please try again.')
            }
            Analytics.record({ name: 'Login fail', attributes: { ex } })
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            signIn()
        }
    }
    return ( <div id="login">
        <h2>Login to share your location</h2>
        <input name="password" type='password' value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
        <button onClick={signIn}>Login</button>
        <div id="message">{message}</div>
        </div>
    )
}

export default Login;