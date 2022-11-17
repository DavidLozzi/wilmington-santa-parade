import React from "react";
import { Loader } from "@googlemaps/js-api-loader";
import route from "../../route";
// import ridersData from '../../riders/list.json';

const loader = new Loader({
  apiKey: "AIzaSyDmYRbkOa-ycaGgHAqc1osu8SI0-F-_pNI",
  version: "weekly"
});

const Map = () => {
//   const [riders, setRiders] = React.useState([])
//   const [markers, setMarkers] = React.useState([])
  const map = React.useRef();

    const getMapLocation = () => {
        const { availWidth } = window.screen;
        let center = { lat: 42.56, lng: -71.17 }; //desktop default
        let zoom = 14.5; //desktop default
        if(availWidth < 400) {
            center = { lat: 42.57, lng: -71.18 };
            zoom = 13;
        }

        return [center, zoom];
    }

//   const moveMarker = () => {
//     const newRiders = [...riders]
//     const rider = newRiders[1]
//     newRiders[1].lat = rider.lat - .008
//     newRiders[1].lng = rider.lng - .008
    
//     const marker = markers[markers.indexOf(markers.find(m => m.title === `${rider.fname} ${rider.lname}`))]
//     marker.setMap(null)

//     // setRiders(newRiders)
//   }

//   React.useEffect(() => {
//     if (riders) {
//       const newMarkers = []
//       riders.forEach(rider => {
//         console.log(rider)
//         const marker = new google.maps.Marker({
//           position: new google.maps.LatLng(rider.lat, rider.lng),
//           icon: 'https://iconsplace.com/download-file/img/3216/mountain-biking-icon-2/ffff00/png/32/',
//           map: map.current,
//           title: `${rider.fname} ${rider.lname}`
//         });
//         const riderInfo = new google.maps.InfoWindow({
//           content: `<div style='color:#000'><h3>${rider.firstName} ${rider.lastName}</h3>${rider.route}<br/>Average Speed:${Math.round(rider.avgSpeed * 100) / 100}mph<br/>TrackerId: ${rider.trackerId}</div>`
//         })
//         marker.addListener('click', () => {
//           riderInfo.open({
//             anchor: marker,
//             map: map.current,
//             shouldFocus: false
//           })
//         })
//         newMarkers.push(marker)
//       })

//       setMarkers(newMarkers)
//     }
//   }, [riders])

  React.useEffect(() => {
    // fetch('https://service3.traq-central.com/root/tracker/2Z6QKQ')
    // .then(resp => console.log(resp))
    console.log(window.screen)
    const [center, zoom] = getMapLocation();
    loader.load().then(() => {
      map.current = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom,
        mapId: '5f9489b2e74fcec9'
      });
      const routeMap = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: "#ED252C",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      })
      routeMap.setMap(map.current)

    //   setRiders(ridersData)
    });
  }, [])

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }} id="map">
      </div>
    </>
  );
}

export default Map;