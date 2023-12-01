import SantaPng from '../../assets/logo.png';
import './index.css';

const SantaImage = () => {

  return <div id="hero">
    <img src={SantaPng} id="logo" alt="Wilmington Santa Parade Logo" />
    <h2>December 3rd starting at 8:30am</h2>
  </div>
}

export default SantaImage;