import { Analytics } from '../../analytics';
import { useNavigate } from "react-router-dom";
import Facebook from "../../assets/facebook.png";
import Legend from "../../assets/legend.png";
import './index.css';

const Menu = () => {
    const navigate = useNavigate();

    const goToLearnMore = () => {
        Analytics.record({name: 'Open Learn More'})
        navigate("/about")
    }
    const goToDonate = () => {
        Analytics.record({name: 'Open Donate'})
        navigate("/donate")

    }
    return <div id="menu">
        <a href="https://www.facebook.com/profile.php?id=100064915801501" target="_blank" rel="noreferrer"><img src={Facebook} alt="Facebook icon"/></a>
        <button id="learnMore" onClick={goToLearnMore}>Learn More</button>
        <button id="donate" onClick={goToDonate}>Donate</button>
        <div id="legend"><h4>Approx. Start Times</h4><img src={Legend} alt="Color legend" /></div>
    </div>
}

export default Menu