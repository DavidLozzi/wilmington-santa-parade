import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { STATUS } from '../location';
import './index.css';

const Login = ({ setStatus }) => {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const signIn = async () => {
        try {
            const user = await Auth.signIn('santa', password)
            setStatus(STATUS.LOGGED_IN)
        } catch (ex) {
            console.error(ex)
            setStatus(STATUS.NOT_LOGGED_IN)
            if(ex.toString().indexOf('Incorrect username or password') > -1) {
                setMessage('Incorrect password.')
            }
        }
    }
    return ( <div id="login">
        <h2>Login to share your location</h2>
        <input name="password" type='password' value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={signIn}>Login</button>
        <div id="message">{message}</div>
        </div>
    )
}

export default Login;