import { useState } from 'react';
import SantaPng from '../../assets/logo.png';
import Login from '../login';
import Track from '../track'
import './index.css';

export const STATUS = {
    NOT_LOGGED_IN: 'notloggedin',
    LOGGED_IN: 'loggedin'
}

function Location() {
  const [status, setStatus] = useState(STATUS.NOT_LOGGED_IN);

  return (
    <div id="location">
    <img src={SantaPng} alt="Santa Parade logo" />
    {status === STATUS.NOT_LOGGED_IN && <Login setStatus={setStatus} /> }
    {status === STATUS.LOGGED_IN && <Track /> }
   </div>
  );
}

export default Location;
