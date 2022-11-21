import { useEffect, useState, useRef } from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { createSantaLocation } from '../../graphql/mutations';
import { santaLocationsByIdAndDate } from '../../graphql/queries';
import NoSleep from '../../NoSleep';
import './index.css';

const STATUS = {
    PENDING: 'pending',
    DONE: 'done'
}

const TRACK = {
    ENABLED: 'Stop Auto Tracking',
    DISABLED: 'Enable Auto Tracking'
}

var noSleep = new NoSleep();
noSleep.enable();

const Track = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(STATUS.DONE);
    const [locations, setLocations] = useState([]);
    const [autoTrack, setAutoTrack] = useState(TRACK.DISABLED);
    const autoTrackInterval = useRef()

    const getAllLocations = async () => {
        try {
            const santaData = await API.graphql(graphqlOperation(santaLocationsByIdAndDate,{ lat: 'gt 0', sortDirection: 'DESC' }));
            const santaLocations = santaData.data.listSantaLocations?.items;
            setLocations(santaLocations?.sort((a,b) => a.date < b.date ? 1 : -1).slice(0,10) || []);
            console.log('got', santaLocations.length, 'locations for Santa 🎅')
        } catch(ex) {
            console.error('getSantaLocation', ex);
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
            setTimeout(() => setMessage(''), 2000)
        } catch(ex) {
            getAllLocations()
            setMessage('Roast my chestnuts, there was an error.')
            console.error(ex)
            setStatus(STATUS.DONE)
        }
    }

    const track_click = () => {
        getLocation()
    }

    const autotrack_click = () => {
        if(autoTrackInterval.current){
            clearInterval(autoTrackInterval.current);
            setAutoTrack(TRACK.DISABLED);
        } else {
            setAutoTrack(TRACK.ENABLED);
            autoTrackInterval.current = setInterval(() => {
                getLocation()
            }, 5 * 1000)
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