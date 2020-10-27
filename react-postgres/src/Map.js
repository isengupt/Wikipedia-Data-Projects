import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import MapGL, { Marker, Popup, Source, Layer } from "@urbica/react-map-gl";
import { CustomLayer } from '@urbica/react-map-gl';
import { MapboxLayer } from '@deck.gl/mapbox';

import {CPUGridLayer, HexagonLayer} from '@deck.gl/aggregation-layers';
import "mapbox-gl/dist/mapbox-gl.css";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiaXNlbmd1cHQ3ODE3IiwiYSI6ImNrZzQ3cWduajBpMXoyeGwwd2hpNjRidzcifQ.dek7zmdCnM9T-dMnXrARSQ";
  
  
 
  const Map = () => {
    const [songs, setSongs] = useState([]);
    const [popupInfo, setPopupInfo] = useState(null);
    const [highlights, setHighlights] = useState(null);
    const [barProp, setBarProp] = useState("danceability")
    const [merchants, setMerchants] = useState({
          
      'type': 'FeatureCollection',
      'features': 

      {
        'type': 'Feature',
        'geometry': {
        'type': 'Point',
         'coordinates': [0, 0],

        }
        }
  });
  const [columns, setColumns] = useState([])
    const [pitchAngle, setPitchAngle] = useState(0)
    const [camera, setCamera] = useState(false)
    useEffect(() => {
      getMerchant();
    }, []);
    function getMerchant() {
      fetch('http://localhost:3001')
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data)
          let points =[]
          setColumns(data)
          data.map((item) => {
          var geojson = 
         
            {
            'type': 'Feature',
            'properties': {
              'acousticness': item.acousticness,
                'album': item.album,
                'danceability': item.danceability,
                'genre': item.genre,
                'duration_ms': item.duration_ms,
                'energy': item.danceability,
                'href': item.href,
                'image': item.image,
                'instrumentalness': item.instrumentalness,
                'latitude': Number(item.latitude),
                'longitude': Number(item.longitude),
                'liveness': item.liveness,
                'loudness': item.loudness,
                'music_key': item.music_key,
                'music_label': item.music_label,
                'music_mode': item.music_mode,
                'producers': item.producers,
                'released': item.released,
                'songwriters': item.songwriters,
                'speechiness': item.speechiness,
                'tempo': item.tempo,
                'time_signature': item.time_signature,
                'title': item.title,
                'valence': item.valence
                
              },
            'geometry': {
            'type': 'Point',
            
            'coordinates': [Number(item.longitude), Number(item.latitude)],
   
            }
            }
           
            points.push(geojson)
          })

          let featurePoint = {
          
              'type': 'FeatureCollection',
              'features': points
          }
          
          setMerchants(featurePoint);
        });
    }
    console.log(merchants)

    const COLOR_RANGE = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ];

    function updateHexes() {
      if (barProp == "danceability") {
      setBarProp("music_key")
      console.log('Waa')
      console.log(barProp)
    }
      else {
        setBarProp("danceability")
        console.log('Waa')
        console.log(barProp)}
      }
     
    

    const myDeckLayer = new MapboxLayer({
      id: 'heat-map',
      type: HexagonLayer,
      data: columns,
  
      diskResolution: 12,
        radius: 5000,
        extruded: true,
        colorRange: COLOR_RANGE,
        pickable: true,
        elevationRange: [0, 5000],
        elevationScale: 1000,
        visible: true,
      
        onClick: d => console.log(d),
        getPosition: d => [Number(d.longitude), Number(d.latitude)],
        getElevation: d => Number(d[barProp]) * 50,
        updateTriggers: {
          getElevation: [barProp]
        },
        //getFillColor: d => [48, 128,Number(d.danceability) * 255, 255],
        //getLineColor: [0, 0, 0],
        
    });
  
    const [viewport, setViewport] = useState({
      latitude: 32.8000000, 
      longitude:-115.5670000,
      zoom: 9,
    });
  

    
  
    const [position, setPosition] = useState({
      longitude: 0,
      latitude: 0,
    });
  
    const style = {
      padding: "10px",
      color: "#fff",
      cursor: "pointer",
      background: "#1978c8",
      borderRadius: "6px",
    };
  
    const onDragEnd = (lngLat) => {
      setPosition({ longitude: lngLat.lng, latitude: lngLat.lat });
    };
  
    const onMarkerClick = (event) => {
      alert("You clicked on marker");
      event.stopPropagation();
    };
  
    const _onClickMarker = (city) => {
      setPopupInfo(city);
    };
  
    const  passHighLight = (r) => {
      console.log(r);
      setHighlights(r);
    }

    function switchCamera() {
      if (camera == false) {
      setPitchAngle(40)
      setCamera(true)
      } else {
        setPitchAngle(0)
        setCamera(false)
      }
    }
  
    function _renderPopup() {
      console.log(popupInfo)
      return (
        popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            className="map-pop"
            longitude={popupInfo.properties.longitude}
            latitude={popupInfo.properties.latitude}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <div className="pop-info">
              <div className="pop-title"> {popupInfo.properties.title}</div>
              <img className="pop-image" width={120} src={popupInfo.properties.image} />
              <div className="pop-title" onClick={() => switchCamera()}> click Me</div>
            </div>
          </Popup>
        )
      );
    }


 
  
  
    return (
      <div className="simple-todos-react">
        <MapGL
          style={{ width: "100%", height: "600px" }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          accessToken={MAPBOX_ACCESS_TOKEN}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={setViewport}
          pitch= {pitchAngle}
        >
 <CustomLayer layer={myDeckLayer} />



 <Source id='points' type='geojson' data={merchants} />
 
 <Layer
      id='points'
    
      type='circle'
      source='points'
      paint={{
        'circle-radius': 1,
        'circle-color': '#fff',
      
        

      }}
    />
    <Layer
      id='points1'
      onClick = {(d) => setPopupInfo(d['features'][0])}
      type='circle'
    
      source='points'
      paint={{
        'circle-radius': 5,
        'circle-color': '#eee272',
        'circle-blur': 3,
        'circle-opacity': 0.4
        

      }}
    />

<Layer
      id='points2'
    
      type='circle'
      source='points'
      paint={{
        'circle-radius': 5,
        'circle-color': '#e5fe95',
        'circle-blur': 3,
        'circle-opacity': 0.4
        

      }}
    />



{_renderPopup()} 

        
        </MapGL>
        <div className="control-panel">

<div className="toggleCamera" onClick={() => switchCamera()}>Toggle Camera</div>

{camera ? 
<>
<div className="level-control">Danceability</div>
<div className="level-control" onClick={() => updateHexes()}>Acoustic</div>
<div className="level-control">Producer</div>
</>
:
<>
</>}
</div>
      </div>
    );
  };

export default Map;
