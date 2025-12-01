import { useEffect, useState, useRef } from 'react'
import { API, Auth, graphqlOperation } from 'aws-amplify';
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
  DISABLED: 'Start Auto Tracking'
}

const MAX_LOCATIONS_DISPLAYED = 10;
const MAX_FETCHED_LOCATIONS = 50;
const PARADE_TIME_ZONE = 'America/New_York';

const getParadeDateString = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', { 
    timeZone: PARADE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

const getTimestamp = (location) => {
  if (!location) {
    return null;
  }
  const candidates = [location.createdAt, location.updatedAt];
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

const dedupeLocations = (items) => {
  const seen = new Map();
  (items || []).forEach((item) => {
    if (!item) {
      return;
    }
    const key = item.id || `${item.lat}-${item.lng}-${item.date}`;
    if (!seen.has(key)) {
      seen.set(key, item);
      return;
    }
    const existing = seen.get(key);
    const existingTimestamp = getTimestamp(existing);
    const incomingTimestamp = getTimestamp(item);
    if (incomingTimestamp !== null && incomingTimestamp > existingTimestamp) {
      seen.set(key, item);
    }
  });
  return Array.from(seen.values());
}

const formatDisplayDate = (location) => {
  const timestamp = getTimestamp(location);
  if (timestamp === null) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: PARADE_TIME_ZONE,
    timeZoneName: 'short'
  }).format(new Date(timestamp));
}

const normalizeLocations = (items) => {
  return dedupeLocations(items)
    .map((item) => ({ item, timestamp: getTimestamp(item) }))
    .filter(({ item, timestamp }) => item && timestamp !== null)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_LOCATIONS_DISPLAYED)
    .map(({ item }) => item);
}

const Track = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(STATUS.DONE);
  const [locations, setLocations] = useState([]);
  const [autoTrack, setAutoTrack] = useState(TRACK.DISABLED);
  const autoTrackInterval = useRef()

  const formatErrorMessage = (error, fallback) => {
    if (!error) {
      return fallback;
    }
    const messageFromError =
      error?.message ||
      error?.errors?.[0]?.message ||
      error?.errors?.[0]?.originalError?.message ||
      error?.toString?.();
    if (messageFromError?.toLowerCase().includes('401')) {
      return 'Authentication expired or API key is invalid. Refresh the API key (amplify pull) or login again.';
    }
    return messageFromError || fallback;
  }

  const handleAuthError = (error) => {
    console.error('auth error', error);
    const errorMessage = formatErrorMessage(error, 'Authentication required. Please login again.');
    Analytics.record({ name: 'auth error', attributes: { ex: errorMessage } });
    if (autoTrackInterval.current) {
      clearInterval(autoTrackInterval.current);
      autoTrackInterval.current = null;
    }
    setAutoTrack(TRACK.DISABLED);
    setStatus(STATUS.DONE);
    setMessage(errorMessage);
  }

  const ensureAuthenticated = async (bypassCache = false) => {
    try {
      await Auth.currentAuthenticatedUser({ bypassCache });
      return true;
    } catch (authError) {
      handleAuthError(authError);
      return false;
    }
  }

  const callApi = async (operation, requireUser = false) => {
    if (requireUser) {
      const authed = await ensureAuthenticated(true);
      if (!authed) {
        throw new Error('Authentication required');
      }
    }
    try {
      return await API.graphql({ ...operation, authMode: 'API_KEY' });
    } catch (apiError) {
      const errorMessage = formatErrorMessage(apiError, 'An error occurred.');
      console.warn('API request failed', apiError);
      if (requireUser) {
        handleAuthError(apiError);
      } else {
        setMessage(`Oops an error occurred retrieving your locations. ${errorMessage}`);
      }
      throw apiError;
    }
  }

  const getAllLocations = async () => {
    try {
      const todayDate = getParadeDateString();
      const options = {
        sort: 'yes',
        sortDirection: 'DESC',
        limit: MAX_FETCHED_LOCATIONS,
        date: { eq: todayDate }
      };

      const operation = graphqlOperation(byDate, options);
      const santaData = await callApi(operation);
      const santaLocations = santaData.data.byDate?.items || [];
      const normalizedLocations = normalizeLocations(santaLocations);

      setLocations(normalizedLocations);
      console.log('got', normalizedLocations.length, 'locations for Santa 🎅');
      setMessage('');
    } catch (ex) {
      console.error('getSantaLocation', ex);
      const readable = formatErrorMessage(ex, 'An error occurred.');
      Analytics.record({ name: 'get locations error', attributes: { ex: readable } })
      setMessage(`Oops an error occurred retrieving your locations. ${readable}`)
    }
  }

  const getLocation = () => {
    ensureAuthenticated().then((authed) => {
      if (!authed) {
        return;
      }
      setMessage('Retrieving location')
      setStatus(STATUS.PENDING)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition)
      } else {
        console.error('geolocation is not supported');
        setMessage('Cannot retrieve location');
      }
    });
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
        date: getParadeDateString(),
        sort: 'yes'
      }
      const operation = graphqlOperation(createSantaLocation, { input: location })
      await callApi(operation, true)
      getAllLocations()
      setMessage('Location saved!')
      setStatus(STATUS.DONE)
      setTimeout(() => setMessage(''), 5000)
    } catch (ex) {
      const readable = formatErrorMessage(ex, 'Roast my chestnuts, there was an error.')
      Analytics.record({ name: 'get position error', attributes: { ex: readable } })
      getAllLocations()
      setMessage(readable)
      console.error(ex)
      setStatus(STATUS.DONE)
    }
  }

  const track_click = () => {
    Analytics.record({ name: 'Track clicked' })
    getLocation()
  }

  const autotrack_click = () => {
    Analytics.record({ name: 'Autotrack clicked' })
    if (autoTrackInterval.current) {
      clearInterval(autoTrackInterval.current);
      setAutoTrack(TRACK.DISABLED);
      autoTrackInterval.current = null;
    } else {
      ensureAuthenticated().then((authed) => {
        if (!authed) {
          return;
        }
        setAutoTrack(TRACK.ENABLED);
        getLocation()
        autoTrackInterval.current = setInterval(() => {
          getLocation()
        }, 30 * 1000)
      })
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
    ensureAuthenticated().then((authed) => {
      if (authed) {
        getAllLocations();
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="track">
      <h3>Press below to Track your current location.</h3>
      <button onClick={track_click} disabled={status !== STATUS.DONE}>Track</button>
      <button onClick={autotrack_click} disabled={status !== STATUS.DONE}>{autoTrack}</button>
      {autoTrack === TRACK.ENABLED && (
        <p className="auto-track-note">
          Keep the device on and stay on this page. It will automatically update your location every 1 minute.
        </p>
      )}
      <div id="message">{message}</div>
      <div id="list">
        <h4>{locations.length} most recent tracked locations:</h4>
        {locations.map(l =>
          <div key={l.id || l.date || getTimestamp(l)} className="location">{formatDisplayDate(l)} - {l.lat.toString().substring(0, 6)} x {l.lng.toString().substring(0, 7)}</div>
        )}
      </div>
      {/* <h3 id="photo">Upload a Photo</h3>
            <input type="file" onChange={photo_change} /> */}
    </div>
  )
}

export default Track;