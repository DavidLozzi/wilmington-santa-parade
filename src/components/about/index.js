
import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { byDate } from "../../graphql/queries";
import TargetSanta from '../../assets/target_santa.png';
import RouteLegend from '../routeLegend';
import GreenFlag from '../../assets/green-flag.svg';
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
        <p><strong>Sunday, December 7th: </strong>The Santa Parade tours much of Wilmington, MA starting at 8:00 AM.
            Use this site to track the current location of Santa on December 7th.</p>
        <p><strong>Santa's Routes</strong> <RouteLegend className="about-legend" /> weave like tinsel throughout Wilmington. Even Santa needs a break every once in a while.
        His route is broken into 6 parts, color-code here. These times are estimates. The  <img src={GreenFlag} alt="Green flag start icon" style={{width: '20px'}} /> indicates the start of the route.</p>
        <p><strong>Please donate!</strong> <Link to="/donate">Learn more here</Link></p>
        {showTrackSanta && 
            <p><strong>Can't find Santa?</strong> Try the Locate Santa button at the lower right, that should take you to his last known location.
            <img src={TargetSanta} alt="Locate Santa example" /></p>
        }
        
        <h3>About the Elves</h3>
        <p>The Wilmington Santa Parade is a fun event for all! Big thanks to the Wilmington Fire Department for 
            hosting our parade, Santa and Mrs. Claus. Join us on <a href="https://www.facebook.com/profile.php?id=100064915801501" alt="Link to Facebook" target="_blank" rel="noreferrer">Facebook</a></p>
        <p>This site was created with eggnog and Christmas cheer by <a href="https://davidlozzi.com/my-apps/" alt="Link to the creator's site" target="_blank" rel="noreferrer">David Lozzi</a>.</p>
    </div>
}

export default About