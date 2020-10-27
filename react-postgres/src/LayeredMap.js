import React, { useState, useEffect } from "react";
import DeckGL from "deck.gl";
import { StaticMap, Popup } from "react-map-gl";
import { ScatterplotLayer, ArcLayer } from "@deck.gl/layers";
import { GridLayer } from "@deck.gl/aggregation-layers";
import RangeSlider from "./RangeSlider";
import LineChart from "./LineChart";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import "mapbox-gl/dist/mapbox-gl.css";
import { WebMercatorViewport } from "@deck.gl/core";
import ExtraInfo from "./ExtraInfo";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

const maxVals = {
  latitude: [-90, 90],
  longitude: [-180, 180],
  acousticness: [0.0, 1.0],
  danceability: [0.0, 1.0],
  energy: [0.0, 1.0],
  instrumentalness: [0.0, 1.0],
  liveness: [0.0, 1.0],
  loudness: [-60, 0],
  speechiness: [0.0, 1.0],
  valence: [0.0, 1.0],
  tempo: [0.0, 300, 0],
  time_signature: [0.0, 5.0],
  music_mode: [0.0, 1.0],
  music_key: [0.0, 11.0],
  duration_ms: [0.0, 4000000.0],
};
/* const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
}; */
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiaXNlbmd1cHQ3ODE3IiwiYSI6ImNrZzQ3cWduajBpMXoyeGwwd2hpNjRidzcifQ.dek7zmdCnM9T-dMnXrARSQ";
// data needed for overlay here

function LayeredMap() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [arcsLoaded, setArcsLoaded] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [items, setItems] = React.useState([
    { label: "Loading ...", value: "" },
  ]);
  const [bounds, setBounds] = useState([
    [-75.41911645507791, 41.33030623758615],
    [-73.33995385742169, 40.081107768650526],
  ]);
  const [ranges, setRanges] = React.useState([1950, 2020]);
  const [arcCoords, setArcCoords] = useState([
    {
      inbound: 72633,
      outbound: 74735,
      from: {
        name: "19th St. Oakland (19TH)",
        coordinates: [-122.269029, 37.80787],
      },
      to: {
        name: "12th St. Oakland City Center (12TH)",
        coordinates: [-122.271604, 37.803664],
      },
    },
  ]);
  const [merchants, setMerchants] = useState([]);
  const [value, setValue] = React.useState("danceability");

  useEffect(() => {
    getMerchant();
  }, []);

  function getMerchant() {
    fetch("http://localhost:3001")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMerchants(data);
        let selectVals = [];
        let psqlQuery = [];
        Object.keys(data[0]).map((opt) => {
          if (!isNaN(parseFloat(data[0][opt]))) {
            selectVals.push({ label: opt, value: opt });
            psqlQuery.push(opt);
          }
        });

        setItems(selectVals);
        setLoading(false);
      });
  }

  function createMerchant(values, bounds) {
    fetch("http://localhost:3001/merchants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values, bounds }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setMerchants(data);
      });
  }

  function getArcs(values, selection) {
    fetch("http://localhost:3001/genre", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values, selection }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let arcpoints = [];
        data.map((item) => {
          arcpoints.push({
            inbound: 72633,
            outbound: 74735,
            from: {
              coordinates: [
                Number(popupInfo.longitude),
                Number(popupInfo.latitude),
              ],
            },
            to: {
              coordinates: [Number(item.longitude), Number(item.latitude)],
            },
          });
        });
        console.log(arcpoints);
        setArcCoords(arcpoints);
      });
  }

  /*   const layer = new IconLayer({
    id: "icon-layer",
    data: merchants,
    pickable: true,
    // iconAtlas and iconMapping are required
    // getIcon: return a string
    //iconAtlas:
    // "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    //iconMapping: ICON_MAPPING,
    getIcon: (d) => ({
      url:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      x: 0,
      y: 0,
      width: 128,
      height: 128,
      mask: true,
    }),

    sizeScale: 15,
    getPosition: (d) => [Number(d.longitude), Number(d.latitude)],
    getSize: (d) => d[value] * 5,
    getColor: (d) => [Math.sqrt(1), 140, 0],
    transitions: {
      // transition with a duration of 3000ms
      getSize: 3000,
    },
    updateTriggers: {
      // if showLibraries changes, recompute getFillColor for each point
      getSize: [value],
    },
  }); */

  const hexlayer = new HexagonLayer({
    coverage: 1,
    data: merchants,
    pickable: true,
    visible: rotated,
    autoHighlight: true,
    elevationRange: [0, 3000],
    onClick: (d) => setPopupInfo(d["object"]),
    elevationScale: 50,
    extruded: true,
    getPosition: (d) => [Number(d.longitude), Number(d.latitude)],
    radius: 1000,
    upperPercentile: 100,
    updateTriggers: {
      visible: [rotated],
      elevationScale: [rotated],
    },
    colorRange: [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78],
    ],
  });

  //    Math.abs(d[value] / (maxVals[value][1] - maxVals[value][0])) *

  const librariesLayer = new ScatterplotLayer({
    id: "points-layer",
    data: merchants,
    opacity: 0.4,
   // onHover: (d) => setPopupInfo(d["object"]),
    onClick: (d) => setPopupInfo(d["object"]),
    visible: !rotated,
    filled: true,
    radiusScale: 2,
    radiusMinPixels: 2,
    radiusMaxPixels: 40,
    pickable: true,

    getPosition: (d) => [Number(d.longitude), Number(d.latitude)],
    getFillColor: (d) => [
      103,
      217,
      Math.abs(d[value] / (maxVals[value][1] - maxVals[value][0])) * 112,
    ],

    getRadius: (d) =>
      (d[value] / (maxVals[value][1] - maxVals[value][0])) * 1000,
    transitions: {
      // transition with a duration of 3000ms
      getRadius: 3000,
      getFillColor: 3000,
    },
    updateTriggers: {
      // if showLibraries changes, recompute getFillColor for each point
      getRadius: [value],
      getFillColor: [value],

      visible: [rotated],
    },
  });

  const arclayer = new ArcLayer({
    id: "arc-layer",
    data: arcCoords,
    pickable: false,
    visible: arcsLoaded,
    getWidth: 2,
    getSourcePosition: (d) => d.from.coordinates,
    getTargetPosition: (d) => d.to.coordinates,
    getSourceColor: (d) => [103, 217, 112],
    getTargetColor: (d) => [103, 217, 112],
    transitions: {
      getSourcePosition: 3000,
      getTargetPosition: 3000,
    },
    updateTriggers: {
      getSourcePosition: [arcCoords],
      getTargetPosition: [arcCoords],
      visible: [arcsLoaded],
    },
  });

  function checkGenre(genre) {
    console.log(genre);
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
    <>
      <React.Fragment>
        <DeckGL
          initialViewState={{
            longitude: -74.006,
            latitude: 40.7128,
            zoom: 8,
            pitch: rotated ? 40.5 : 0
          }}
          height="100%"
          width="100%"
          controller={true}
          onViewStateChange={({ viewState }) => {
            const viewport = new WebMercatorViewport(viewState);

            const nw = viewport.unproject([0, 0]);
            const se = viewport.unproject([viewport.width, viewport.height]);

            setBounds([nw, se]);
          }}
          layers={[librariesLayer, arclayer, hexlayer]} // layer here
        >
          {/* {({x, y, width, height, viewState, viewport}) => (
    console.log(viewState)
    )} */}
          <StaticMap
            mapStyle="mapbox://styles/isengupt7817/ckgqxi9582hkr19n1zff0vu0x"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            pitch={rotated ? 40.5 : 0}
          ></StaticMap>
        </DeckGL>
      </React.Fragment>

      <div className="control-panel">
        <Typography id="select-label" gutterBottom>
          Audio Feature
        </Typography>
        <select
          disabled={loading}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        >
          {items.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <RangeSlider
          ranges={ranges}
          setRanges={setRanges}
          bounds={bounds}
          createMerchant={createMerchant}
        />
        <LineChart value={value} ranges={ranges} />
        

        <button className="rotate-button" onClick={() => setRotated(!rotated)}>
          See Frequencies
        </button>
      </div>

      <div className="song-info">
    <ExtraInfo
          popupInfo={popupInfo}
          getArcs={getArcs}
          setArcsLoaded={setArcsLoaded}
        />
        </div>
    </>

  );
}

export default LayeredMap;
