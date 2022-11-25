
import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { byDate } from "../../graphql/queries";
import TargetSanta from '../../assets/target_santa.png';
import Legend from '../../assets/legend.png';
import Start from '../../assets/start.png';
import './index.css';

const About = () => {
    const [showTrackSanta, setShowTrackSanta] = useState(false);

    useEffect(() => {
        const getSanta = async () => {
            const options = { 
                sort: 'yes',
                sortDirection: 'DESC',
                limit: 1
            }
            const santaData = await API.graphql(graphqlOperation(byDate, options));
            const santaLocations = santaData.data.byDate.items;
            if(santaLocations.length > 0) {
                setShowTrackSanta(true)
            }
        }
        getSanta()
    }, [])

    return <div id="about">
        <h1>The Wilmington Santa Parade</h1>
        <p><strong>Sunday, December 4th: </strong>The Santa Parade tours much of Wilmington, MA through all of Sunday, Dec 4th.
            Use this site to track the current location of Santa on December 4th.</p>
        <p><strong>Santa's Routes</strong> <img src={Legend} alt="Legend of color routes" className="legend" /> weave like tinsel throughout Wilmington. Even Santa needs a break every once in a while.
        His route is broken into 6 parts, color-code here. These times are estimates. The  <img src={Start} alt="Start icon" style={{width: '20px'}} /> indicates the start of the route.</p>
        <p><strong>Please donate!</strong> <Link to="/donate">Learn more here</Link></p>
        {showTrackSanta && 
            <p><strong>Can't find Santa?</strong> Try the Locate Santa button at the lower right, that should take you to his last known location.
            <img src={TargetSanta} alt="Locate Santa example" /></p>
        }
        
        <h2>More Santa</h2>
        <p><strong>Saturday, December 3rd: </strong>Santa will be making 2 stops around town. They will be at 
        the Shawsheen School from 11:00 am - 11:45 am and the North Intermediate School from 1:00 pm - 1:45 pm.
        Come down and take your pictures with Samta and Mrs Claus. Santa will be bringing all his friends. At
        each stop, we will be collecting toys for the Wilmington Fire Department's Toys for Wilmington Children,
        food for the Wilmington Food Pantry and letters to the troops. So come on down. We missed seeing everyone!!</p>
        <p><strong>Children with physical handicap or illness:</strong> On Saturday, December 3rd we'd like to give a chance for those kids that can't 
        come out to see Santa to be able to see Santa and Mrs Claus. We will be setting aside some time for 
        children who are physically unable to see Santa due to an illness or physical handicap. Santa and 
        his helpers will stop off at a few houses this year and come to the door to greet a few Wilmington 
        children. If you are a parent of a child who is ill or physically unable to come out to see Santa, 
        please fill out <a href="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fforms.office.com%2fr%2f6NRHreW3JH&c=E,1,9-Y_u22b_Mv4sA6x_4WhJ6PBdlgwhmLbDpR0sA8GUNnIASdygQI6RWypyLmwn0i3kQxAEeXMb2zJuSZDqni5bnLn4XmurkRs7Tdxv9Kth9eCtgRsmOw,&typo=1" target="_blank"  rel="noreferrer" alt="link to the form">this form</a> and
        we will help organize a quick visit. We stress this is not for healthy kids!!! If you want Santa
        to provide a gift, there is an option for you to drop off a gift prior to the event which we will give to the child. </p>

        <h3>About the Elves</h3>
        <p>The Wilmington Santa Parade is a fun event for all! Big thanks to the Wilmington Fire Department for 
            hosting our parade, Santa and Mrs. Claus. Join us on <a href="https://www.facebook.com/profile.php?id=100064915801501" alt="Link to Facebook" target="_blank" rel="noreferrer">Facebook</a></p>
        <p>This site was created with eggnog and Christmas cheer by <a href="https://davidlozzi.com/my-apps/" alt="Link to the creator's site" target="_blank" rel="noreferrer">David Lozzi</a>.</p>
    </div>
}

export default About