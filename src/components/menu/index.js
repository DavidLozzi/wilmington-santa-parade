import { useNavigate } from "react-router-dom";
import './index.css';

const Menu = () => {
    const navigate = useNavigate();

    const goToLearnMore = () => {
        navigate("/about")
    }
    return <div id="menu">
        <button id="learnMore" onClick={goToLearnMore}>Learn More</button>
        <button id="donate">Donate</button>
    </div>
}

export default Menu