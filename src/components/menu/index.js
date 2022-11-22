import { useNavigate } from "react-router-dom";
import Facebook from "../../assets/facebook.png";
import './index.css';

const Menu = () => {
    const navigate = useNavigate();

    const goToLearnMore = () => {
        navigate("/about")
    }
    return <div id="menu">
        <a href="https://www.facebook.com/profile.php?id=100064915801501" target="_blank" rel="noreferrer"><img src={Facebook} alt="Facebook icon"/></a>
        <button id="learnMore" onClick={goToLearnMore}>Learn More</button>
        <button id="donate">Donate</button>
    </div>
}

export default Menu