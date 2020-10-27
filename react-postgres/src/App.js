import React, {useState, useEffect} from 'react';

import MapGL, { Popup } from "@urbica/react-map-gl";

import Pins from "./pins";
import "mapbox-gl/dist/mapbox-gl.css";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiaXNlbmd1cHQ3ODE3IiwiYSI6ImNrZzQ3cWduajBpMXoyeGwwd2hpNjRidzcifQ.dek7zmdCnM9T-dMnXrARSQ";
  
  
 
  const App = () => {
    const [songs, setSongs] = useState([]);
    const [popupInfo, setPopupInfo] = useState(null);
    const [highlights, setHighlights] = useState(null);
    const [merchants, setMerchants] = useState([]);
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
          
          setMerchants(data);
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
  
    function _renderPopup() {
      return (
        popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            className="map-pop"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <div className="pop-info">
              <div className="pop-title"> {popupInfo.title}</div>
              <img className="pop-image" width={120} src={popupInfo.image} />
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
      >
        <Pins data={merchants}  onClick={_onClickMarker} />

        {_renderPopup()}
      </MapGL>
    
    </div>
    );
  };

export default App;
