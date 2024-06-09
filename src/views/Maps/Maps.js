import React, { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"
// import the mapbox styles
// alternatively can use a link tag in the head of public/index.html
// see https://docs.mapbox.com/mapbox-gl-js/api/
import "mapbox-gl/dist/mapbox-gl.css"
import axios from "axios"
// import "./app.css"
// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = "pk.eyJ1Ijoia2hhbmh0diIsImEiOiJjbGxvc3NucjUwMHVnM2twYm43dmdpOWg3In0.2TTh_u4_Oc0Eujb7iOmncw"
const App = () => {
  const mapContainer = useRef()
  // this is where all of our map logic is going to live
  // adding the empty dependency array ensures that the map
  // is only rendered once
  useEffect(() => {
    // create the map and configure it
    // check out the API reference for more options
    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      // mapbox://styles/mapbox/standard
      // mapbox://styles/mapbox/streets-v11
      // mapbox://styles/mapbox/outdoors-v11
      // mapbox://styles/mapbox/light-v10
      // mapbox://styles/mapbox/dark-v10
      // mapbox://styles/mapbox/satellite-v9
      // mapbox://styles/mapbox/satellite-streets-v11
      // mapbox://styles/mapbox/navigation-day-v1
      // mapbox://styles/mapbox/navigation-night-v1
      center: [105.82844553588713, 21.00651476477521],
      zoom: 15,
      // pitch: 60,
      // bearing: 80,
    })
    // only want to work with the map after it has fully loaded
    // if you try to add sources and layers before the map has loaded
    // things will not work properly
    try
    {
        map.on("load", () => {
          axios.get('http://117.0.35.45:9989/deviceList')
          .then(res => {
            const listLocations = res.data.map(item => (
              {
                type: "Feature",
                properties: {
                  title: item.deviceName,
                  description: item.serialNo,
                  lastSeenAt: item.lastSeenAt,
                  info: JSON.parse(item['/84/0']),
                  // description: {meterReading: item.meterReading, batteryVoltage: Number(item.voltage)/100.00}
                  description: {Meter_reading: item.meterReading.toString() + 'L', Battery: Math.round(((8500*1000 - (((item.lastSeenAt-item.installTime)*30)/(3600*1000)) - item.numberOfUpdates*1394.52)/(8500*1000))*100).toString() + '%'}
                },
                geometry: {
                  coordinates: [item.longitude, item.latitude],
                  type: 'Point'
                }
              }
            ))
            let onlineDevicelist=[];
            let offlineDevicelist=[];
            for(let i=0; i<listLocations.length; i++)
            {
              // if(listLocations[i].properties.title === 'SWM_016')
              // if((Number(Date.now()) - Number(listLocations[i].properties.lastSeenAt))/1000) <= (Number(listLocations[i].properties.info.reportPeriod)+60)))
              if(((Number(Date.now()) - Number(listLocations[i].properties.lastSeenAt))/1000) <= (Number(listLocations[i].properties.info.reportPeriod)+60))
              {
                onlineDevicelist = [...onlineDevicelist, listLocations[i]];
              }
              else
              {
                offlineDevicelist = [...offlineDevicelist, listLocations[i]];
              }
            }
            map.loadImage('/onlineDevice.png',
            (error, image) => {
              if(error) console.log(error);
              map.addImage('device', image);
              map.addSource("online-devices", 
              {
                type: "geojson",
                data: {
                type: "FeatureCollection",
                features: onlineDevicelist
                }
              }
              )
              map.addLayer({
                id: "online-devices",
                type: "symbol",
                source: "online-devices",
                layout: {
                  "icon-image": "device",
                  // 'icon-allow-overlap': true,
                  'icon-ignore-placement': true,
                  "text-field": ["get", "title"],
                  "text-size": 16,
                  "text-offset": [0, 2.5]
                },
                paint: {
                  "text-color": "#ffffff"
                  // "text-halo-color": "#ffffff",
                  // "text-halo-width": 0.5,
                }
              })
            })
            //
            map.loadImage('/offlineDevice.png',
            (error, image) => {
              if(error) console.log(error);
              map.addImage('offline-device', image);
              map.addSource("offline-devices", 
              {
                type: "geojson",
                data: {
                type: "FeatureCollection",
                features: offlineDevicelist
                }
              }
              )
              map.addLayer({
                id: "offline-devices",
                type: "symbol",
                source: "offline-devices",
                layout: {
                  "icon-image": "offline-device",
                  // 'icon-allow-overlap': true,
                  'icon-ignore-placement': true,
                  "text-field": ["get", "title"],
                  "text-size": 16,
                  "text-offset": [0, 2.5],
                },
                paint: {
                  "text-color": "#ffffff"
                  // "text-halo-color": "#ffffff",
                  // "text-halo-width": 0.5,
                }
              })
            })
          })
          .catch(err => console.log(err))
          
          
        })
        map.on('idle', (e) => {
          // do things every time the map idles
          // Create a popup, but don't add it to the map yet.
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        // onlineDevice
        map.on('mouseenter', 'online-devices', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
    
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
    
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });
    
        map.on('mouseleave', 'online-devices', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
        // oofflineDevice
        map.on('mouseenter', 'offline-devices', (e) => {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';
    
          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
    
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
    
          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });
    
      map.on('mouseleave', 'offline-devices', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
      });
        });
    }
    catch(err)
    {
      console.log("Error: ", err.message);
    }
    
    // cleanup function to remove map on unmount
    return () => map.remove()
  }, [])
  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
}
export default App