import SantaPng from '../../assets/logo.png';
import './index.css';

const SantaImage = () => {

  return <div id="hero">
    <img src={SantaPng} id="logo" alt="Wilmington Santa Parade Logo" />
    <h2>December 7th starting at 8:00 AM</h2>
  </div>
}

export default SantaImage;