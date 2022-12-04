import React, { useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { API, graphqlOperation } from 'aws-amplify';
import { Analytics } from '../../analytics';
import r0900 from "../../routes/0900";
import r1030 from "../../routes/1030";
import r1115 from "../../routes/1115";
import r1255 from "../../routes/1255";
import r1340 from "../../routes/1340";
import r1430 from "../../routes/1430";
import { byDate } from "../../graphql/queries";
import SantaHead from '../../assets/santa_head.png';
import Start from '../../assets/start.png';
import Past from '../../assets/past.png';
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
  const santaPath = React.useRef();

  const getMapLocation = () => {
      const { availWidth } = window.screen;
      let center = { lat: 42.56, lng: -71.17 }; //desktop default
      let zoom = 13.4; //desktop default
      if(availWidth < 500) {
          center = { lat: 42.562, lng: -71.17 };
          zoom = 12.8;
      }

      return [center, zoom];
  }

  const getSantaLocation = async () => {
    try {
      const options = { 
        sort: 'yes',
        sortDirection: 'DESC',
        limit: 10
    }
      const santaData = await API.graphql(graphqlOperation(byDate, options));
      const santaLocations = santaData.data.byDate.items;
      if(santaLocations.length > 0 && new Date(santaLocations[0].createdAt).toDateString() === new Date().toDateString()) {
        setSantaProgress(santaLocations);
        console.log('got', santaLocations.length, 'locations for Santa 🎅')
      } else {
        console.log('no santa today')
      }
    } catch(ex) {
      console.error('getSantaLocation', ex);
      Analytics.record({ name: 'Get Santa Error', attributes: { ex } })
    }
  }

	const goToSanta = () => {
    Analytics.record({ name: 'Locate Santa Button'})
		const santa = santaProgress[0]
		map.current.setCenter(santa)
	}

  const drawMarker = (latLng, icon, _map, title, content, zIndex = 5) => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latLng.lat, latLng.lng),
      icon,
      map: _map,
      title,
      zIndex
    });
    const info = new google.maps.InfoWindow({
      content
    })
    marker.addListener('click', () => {
      info.open({
        anchor: marker,
        map: _map,
        shouldFocus: false
      })
    })
    return marker;
  }

  React.useEffect(() => {
		const drawSantasPath = () => {
      santaPath.current?.setMap(null)
			const routeMap = new google.maps.Polyline({
			  path: santaProgress,
			  geodesic: true,
			  strokeColor: "#ED252C",
			  strokeOpacity: 0.6,
			  strokeWeight: 6
			})
      santaPath.current = routeMap
			routeMap.setMap(map.current)
	
			// const lastStops = 20
			// const start = santaProgress[0]
			// const end = santaProgress[lastStops]
			// var display = new google.maps.DirectionsRenderer({ suppressMarkers: true });
			// var services = new google.maps.DirectionsService();
			// display.setMap(map.current);
			// const waypoints = santaProgress.filter((s,i) => i > 0 && i < lastStops).map(s => ({ location: new google.maps.LatLng(s.lat, s.lng)}))
			// var request ={
			// 		origin : start,
			// 		destination: end,
			// 		travelMode: 'DRIVING',
			// 		waypoints
			// };
			// services.route(request,function(result,status){
			// 	if(status === 'OK'){
			// 			display.setDirections(result);
			// 	}
			// });
	
		}

    if (santaProgress?.length > 0) {
      const santa = santaProgress[0]
      const marker = drawMarker(santa, SantaHead, map.current, new Date(santa.date).toLocaleTimeString(), `<div style='color:#000'>Updated ${new Date(santa.date).toLocaleTimeString()}</div>`, 8)

			if(markers.length > 0) {
				markers[0].setMap(null) // deletes other marker
				markers[0] = marker
			} else {
				markers.push(marker)
			}

      // markers for where he was
      for(let i = 1; i < santaProgress.length; i+=2) {
        const arrow = santaProgress[i]
        const marker = drawMarker(arrow, Past, map.current, new Date(arrow.date).toLocaleTimeString(),  `<div style='color:#000'>Santa was here ${new Date(arrow.date).toLocaleTimeString()}</div>`)

        if(markers.length > i) {
          markers[i].setMap(null) // deletes other marker
          markers[i] = marker
        } else {
          markers.push(marker)
        }
      }

      drawSantasPath()
    }
  }, [santaProgress])


  React.useEffect(() => {
    const [center, zoom] = getMapLocation();
    loader.load().then(() => {
      const drawRoute = (path, strokeColor, _map, startTime, zIndex) => {
        const routeMap = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor,
          strokeOpacity: 1,
          strokeWeight: 3,
        })
        routeMap.setMap(_map)
        drawMarker(path[0], Start, _map, `Route starts ${startTime}`, `<div style='color:#000'>Route starts approximately at ${startTime}</div>`, zIndex)
      }
      map.current = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom,
        mapId: '5f9489b2e74fcec9',
        disableDefaultUI: true,
        zoomControl: true
      });
      drawRoute(r0900,'#81459B',map.current, '9:00 am', 7)
      drawRoute(r1030,'#4DB949',map.current, '10:30 am')
      drawRoute(r1115,'#395CAC',map.current, '11:15 am')
      drawRoute(r1255,'#D2C322',map.current, '12:55 pm')
      drawRoute(r1340,'#F46D25',map.current, '1:40 pm')
      drawRoute(r1430,'#E91E25',map.current, '2:30 pm')

      getSantaLocation();
      setInterval(getSantaLocation,30 * 1000)
    });


  }, [])

  return (
    <>
      <div id="map" ref={map} />
      { santaProgress?.length > 0 && <><div id="status">Santa's last location updated: {new Date().toLocaleTimeString()}</div> 
			<button id="targetSanta" onClick={goToSanta}><img src={TargetSanta} alt="Find santa on the map"  /></button></>}
    </>
  );
}

export default Map;