import SantaPng from '../../assets/logo.png';
import './index.css';

const SantaImage = () => {

    return <div id="hero">
        <img src={SantaPng} id="logo" alt="Wilmington Santa Parade Logo" />
        <h2>December 4th starting at 8AM</h2>
        </div>
}

export default SantaImage;