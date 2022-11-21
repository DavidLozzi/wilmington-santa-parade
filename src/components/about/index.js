
import TargetSanta from '../../assets/target_santa.png';
import './index.css';

const About = () => {

    return <div id="about">
        <h1>The Wilmington Santa Parade</h1>
        <p><strong>Sunday, December 4th: </strong>The Santa Parade tours much of Wilmington, MA through all of Sunday, Dec 4th.
            Use this site to track the current location of Santa on December 4th.</p>
        <p><strong>Can't find Santa?</strong> Try the Locate Santa button at the lower right, that should take you to his last known location.
        <img src={TargetSanta} alt="Locate Santa example" /></p>
        
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
        please fill out <a href="https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fforms.office.com%2fr%2f6NRHreW3JH&c=E,1,9-Y_u22b_Mv4sA6x_4WhJ6PBdlgwhmLbDpR0sA8GUNnIASdygQI6RWypyLmwn0i3kQxAEeXMb2zJuSZDqni5bnLn4XmurkRs7Tdxv9Kth9eCtgRsmOw,&typo=1" target="_blank"  rel="noreferrer" alt="link to the form">this form</a>
        and we will help organize a quick visit. We stress this is not for healthy kids!!! If you want Santa
        to provide a gift, there is an option for you to drop off a gift prior to the event which we will give to the child. </p>

        <h3>Fine print</h3>
        <p>The Wilmington Santa Parade is organized by and does this and that and other things....</p>
        <p>This site was created with eggnog and Christmas cheer by <a href="https://davidlozzi.com/my-apps/" alt="Link to the creator's site" target="_blank" rel="noreferrer">David Lozzi</a>.</p>
    </div>
}

export default About