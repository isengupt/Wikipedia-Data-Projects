import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 300,
    color: "rgba(103,217,112)",
    paddingBottom: '10px',
    paddingTop: '10px',
  },
});

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider(props) {
  const classes = useStyles();

  useEffect(() => {
    props.createMerchant(props.ranges, props.bounds);
  }, [props.bounds]);
  const handleChange = (event, newValue) => {
    props.setRanges(newValue);

    props.createMerchant(props.ranges, props.bounds);
  };
  /* 
  function createMerchant(values, bounds) {

    fetch('http://localhost:3001/merchants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({values, bounds}),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data)
      });
  } */

  return (
    <div className={classes.root}>
      <Typography id="range-slider">
        Year Range
      </Typography>
      <Slider
        min={1950}
  
        step={1}
        max={2020}
        value={props.ranges}
        onChange={handleChange}
        valueLabelDisplay="auto"
        
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}
