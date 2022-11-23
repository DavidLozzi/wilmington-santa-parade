import React, { useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { API, graphqlOperation } from 'aws-amplify';
import { Analytics } from '../../analytics';
import route from "../../route";
import { byDate } from "../../graphql/queries";
import SantaHead from '../../assets/santa_head.png';
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
      let zoom = 14.5; //desktop default
      if(availWidth < 500) {
          center = { lat: 42.565, lng: -71.18 };
          zoom = 13;
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
      setSantaProgress(santaLocations);
      console.log('got', santaLocations.length, 'locations for Santa 🎅')
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

  React.useEffect(() => {
		const drawSantasPath = () => {
      santaPath.current?.setMap(null)
			const routeMap = new google.maps.Polyline({
			  path: santaProgress,
			  geodesic: true,
			  strokeColor: "#ED252C",
			  strokeOpacity: 1.0,
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
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(santa.lat, santa.lng),
        icon: SantaHead,
        map: map.current,
        title: new Date(santa.date).toLocaleTimeString(),
        style: { width: '100px'}
      });
      const santaInfo = new google.maps.InfoWindow({
        content: `<div style='color:#000'>Updated ${new Date(santa.date).toLocaleTimeString()}</div>`
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

      // markers for where he was
      for(let i = 1; i < santaProgress.length; i+=2) {
        const arrow = santaProgress[i]
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(arrow.lat, arrow.lng),
          icon: Past,
          map: map.current,
          title: new Date(arrow.date).toLocaleTimeString()
        });
        const santaInfo = new google.maps.InfoWindow({
          content: `<div style='color:#000'>Santa was here ${new Date(arrow.date).toLocaleTimeString()}</div>`
        })
        marker.addListener('click', () => {
          santaInfo.open({
            anchor: marker,
            map: map.current,
            shouldFocus: false
          })
        })
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
        strokeColor: "#00F",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      })
      routeMap.setMap(map.current)
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