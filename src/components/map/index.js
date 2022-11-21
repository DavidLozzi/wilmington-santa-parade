import React, { useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { API, graphqlOperation, SortDirection } from 'aws-amplify';
import route from "../../route";
import { listSantaLocations } from "../../graphql/queries";
import SantaHead from '../../assets/santa_head.png';
import TargetSanta from '../../assets/target_santa.png';
import './index.css';

const loader = new Loader({
  apiKey: "AIzaSyDmYRbkOa-ycaGgHAqc1osu8SI0-F-_pNI",
  version: "weekly"
});
const markers = []

const Map = () => {
  const [santaProgress, setSantaProgress] = useState([]);
  const map = React.useRef();

  const getMapLocation = () => {
      const { availWidth } = window.screen;
      let center = { lat: 42.56, lng: -71.17 }; //desktop default
      let zoom = 14.5; //desktop default
      if(availWidth < 500) {
          center = { lat: 42.565, lng: -71.18 };
          zoom = 13;
      }

      return [center, zoom];
  }

  const getSantaLocation = async () => {
    try {
      const santaData = await API.graphql(graphqlOperation(listSantaLocations, { limit: 20, SortDirection: SortDirection.DESCENDING }));
      const santaLocations = santaData.data.listSantaLocations.items;
      setSantaProgress(santaLocations.sort((a,b) => a.date < b.date ? 1 : -1));
      console.log('got', santaLocations.length, 'locations for Santa 🎅')
    } catch(ex) {
      console.error('getSantaLocation', ex);
    }
  }

	const goToSanta = () => {
		const santa = santaProgress[0]
		map.current.setCenter(santa)
	}

  React.useEffect(() => {
		const drawSantasPath = () => {
			// const routeMap = new google.maps.Polyline({
			//   path: santaProgress,
			//   geodesic: true,
			//   strokeColor: "#000",
			//   strokeOpacity: 1.0,
			//   strokeWeight: 10
			// })
			// routeMap.setMap(map.current)
	
			const lastStops = 20
			const start = santaProgress[0]
			const end = santaProgress[lastStops]
			var display = new google.maps.DirectionsRenderer({ suppressMarkers: true });
			var services = new google.maps.DirectionsService();
			display.setMap(map.current);
			const waypoints = santaProgress.filter((s,i) => i > 0 && i < lastStops).map(s => ({ location: new google.maps.LatLng(s.lat, s.lng)}))
			var request ={
					origin : start,
					destination: end,
					travelMode: 'DRIVING',
					waypoints
			};
			services.route(request,function(result,status){
				if(status === 'OK'){
						display.setDirections(result);
				}
			});
	
		}

    if (santaProgress?.length > 0) {
      const santa = santaProgress[0]
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(santa.lat, santa.lng),
        icon: SantaHead,
        map: map.current,
        title: new Date(santa.date).toLocaleTimeString()
      });
      const santaInfo = new google.maps.InfoWindow({
        content: `<div style='color:#000'>Last updated ${new Date(santa.date).toLocaleTimeString()}</div>`
      })
      marker.addListener('click', () => {
        santaInfo.open({
          anchor: marker,
          map: map.current,
          shouldFocus: false
        })
      })
			if(markers.length > 0) {
				markers[0].setMap(null) // deletes other marker
				markers[0] = marker
			} else {
				markers.push(marker)
			}
			console.log(markers)

      drawSantasPath()
    }
  }, [santaProgress])


  React.useEffect(() => {
    const [center, zoom] = getMapLocation();
    loader.load().then(() => {
      map.current = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom,
        mapId: '5f9489b2e74fcec9',
        disableDefaultUI: true,
        zoomControl: true
      });
      const routeMap = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: "#ED252C",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      })
      routeMap.setMap(map.current)
    });

    getSantaLocation();

    setInterval(getSantaLocation,30 * 1000)
  }, [])

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }} id="map" />
      { santaProgress?.length > 0 && <div id="status">Santa's last location updated: {new Date(santaProgress[0].date).toLocaleTimeString()}</div> }
			<button id="targetSanta" onClick={goToSanta}><img src={TargetSanta} alt="Find santa on the map"  /></button>
    </>
  );
}

export default Map;