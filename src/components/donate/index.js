
import { Link } from 'react-router-dom';
import './index.css';

const Donate = () => {

    return <div id="donate_modal">
        <h1>Donations</h1>
        <p>Throughout the parade on December 4th and our locations on December 3rd (<Link to="/about">learn more here</Link>), 
        we will be collecting donations for:
        <ul>
            <li>Wilmington Fire Department's Toys for Wilmington Children</li>
            <li>Non-perishable food for the Wilmington Food Pantry (<a href="http://www.wilmingtoncommunityfund.org/food-pantry.html" target="_blank" rel="noreferrer">learn more</a>)</li>
            <li>Letters to our troops</li>
        </ul>
        As the parade travels around town, bring your donations up to the parade at any time.
    </p>
    </div>
}

export default Donate