import { useEffect, useState, useRef } from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { Analytics } from '../../analytics';
import { createSantaLocation } from '../../graphql/mutations';
import { byDate } from '../../graphql/queries';
import './index.css';

const STATUS = {
    PENDING: 'pending',
    DONE: 'done'
}

const TRACK = {
    ENABLED: 'Stop Auto Tracking',
    DISABLED: 'Enable Auto Tracking'
}

const Track = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(STATUS.DONE);
    const [locations, setLocations] = useState([]);
    const [autoTrack, setAutoTrack] = useState(TRACK.DISABLED);
    const autoTrackInterval = useRef()

    const getAllLocations = async () => {
        try {
            const options = { 
                sort: 'yes',
                sortDirection: 'DESC',
                limit: 10
            }
            
            const santaData = await API.graphql(graphqlOperation(byDate, options));
            const santaLocations = santaData.data.byDate?.items;
            setLocations(santaLocations || []);
            console.log('got', santaLocations.length, 'locations for Santa 🎅')
            setMessage('')
        } catch(ex) {
            console.error('getSantaLocation', ex);
            Analytics.record({ name: 'get locations error', attributes: { ex } })
            if(ex?.errors?.length > 0) {
                setMessage(`Oops an error occurred retrieving your locations. ${ex.errors[0].message}`)
            } else {
                setMessage('An error occurred.')
            }
        }
    }

    const getLocation = () => {
        setMessage('Retrieving location')
        setStatus(STATUS.PENDING)
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition)
        } else {
            console.error('geolocation is not supported');
            setMessage('Cannot retrieve location');
        }
    }

    const getPosition = async (position) => {
        try {
            console.log(position)
            const { latitude, longitude } = position.coords
            console.log(latitude, longitude)
            setMessage('Location retrieved...')
            const location = {
                lat: latitude,
                lng: longitude,
                date: new Date().toGMTString()
            }
            await API.graphql(graphqlOperation(createSantaLocation,{input: location}))
            getAllLocations()
            setMessage('Location saved!')
            setStatus(STATUS.DONE)
            setTimeout(() => setMessage(''), 5000)
        } catch(ex) {
            Analytics.record({ name: 'get position error', attributes: { ex } })
            getAllLocations()
            setMessage('Roast my chestnuts, there was an error.')
            console.error(ex)
            setStatus(STATUS.DONE)
        }
    }

    const track_click = () => {
        Analytics.record({ name: 'Track clicked'})
        getLocation()
    }

    const autotrack_click = () => {
        Analytics.record({ name: 'Autotrack clicked'})
        if(autoTrackInterval.current){
            clearInterval(autoTrackInterval.current);
            setAutoTrack(TRACK.DISABLED);
            autoTrackInterval.current = null;
        } else {
            setAutoTrack(TRACK.ENABLED);
            getLocation()
            autoTrackInterval.current = setInterval(() => {
                getLocation()
            }, 30 * 1000)
        }
    }

    // const photo_change = async (e) => {
    //     const file = e.target.files[0];
    //     try {
    //       await Storage.put(file.name, file, {
    //         progressCallback(progress) {
    //             console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    //         }
    //       });
    //     } catch (error) {
    //       console.error("Error uploading file: ", error);
    //     }
    // }

    useEffect(() => {
        getAllLocations();
    }, [])

    return (
        <div id="track">
            <h3>Press below to Track your current location.</h3>
            <button onClick={track_click} disabled={status !== STATUS.DONE}>Track</button>
            <button onClick={autotrack_click} disabled={status !== STATUS.DONE}>{autoTrack}</button>
            <div id="message">{message}</div>
            <div id="list">
                <h4>10 most recent tracked locations:</h4>
                {locations.map(l => 
                    <div key={l.date} className="location">{new Date(l.date).toLocaleTimeString()} - {l.lat.toString().substring(0,6)} x {l.lng.toString().substring(0,7)}</div>
                )}
            </div>
            {/* <h3 id="photo">Upload a Photo</h3>
            <input type="file" onChange={photo_change} /> */}
        </div>
    )
}

export default Track;