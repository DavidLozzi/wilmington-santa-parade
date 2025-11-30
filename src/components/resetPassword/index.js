import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Analytics } from '../../analytics';
import './index.css';

const STATUS = {
  PENDING: 'pending',
  DONE: 'done'
}

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(STATUS.DONE);
  const [message, setMessage] = useState('');

  const resetPassword = async () => {
    if (status !== STATUS.DONE) {
      return;
    }
    if (!currentPassword || !newPassword) {
      setMessage('Both current and new passwords are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password values do not match.');
      return;
    }

    setStatus(STATUS.PENDING);
    setMessage('Updating password...');
    Analytics.record({ name: 'Reset password attempt' });

    try {
      const user = await Auth.signIn('mrsclaus', currentPassword);
      if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
        await Auth.completeNewPassword(user, newPassword);
        await Auth.currentAuthenticatedUser({ bypassCache: true });
        Analytics.record({ name: 'Reset password success' });
        setMessage('Password updated! Return to the login screen to continue.');
      } else {
        setMessage('Password was already updated. Try logging in instead.');
      }
    } catch (ex) {
      console.error('reset password error', ex);
      Analytics.record({ name: 'Reset password error', attributes: { ex: ex?.message || ex?.toString?.() } });
      if (ex?.message) {
        setMessage(ex.message);
      } else {
        setMessage('Unable to update password. Please try again.');
      }
    } finally {
      setStatus(STATUS.DONE);
    }
  }

  return (
    <div id="resetPassword">
      <h2>Reset Password</h2>
      <p>Enter your current temporary password and choose a new one.</p>
      <label>
        Current password
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </label>
      <label>
        New password
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <label>
        Confirm new password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <button onClick={resetPassword} disabled={status !== STATUS.DONE}>Update password</button>
      <div id="message">{message}</div>
      <p><a href="/track">Back to login</a></p>
    </div>
  )
}

export default ResetPassword;

