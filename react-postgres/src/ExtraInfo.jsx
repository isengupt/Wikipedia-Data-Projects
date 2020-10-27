import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value}°C`;
}

const data = [
    {label: "album", value:"album" },
    {label: "title", value:"title" },
    {label: "producers", value:"producers" },
    {label: "songwriters", value:"songwriters" },   
    {label: "genre", value:"genre" }


]

export default function ExtraInfo(props) {
  

 const [value, setValue] = React.useState("producers");
 const [loading, setLoading] = React.useState(true);
 const [items, setItems] = React.useState([
   { label: "Loading ...", value: "" },
 ]);

 const classes = useStyles();



 console.log(props.popupInfo)

 React.useEffect(() => {
    setItems(data);
    setLoading(false)
 })

  function checkGenre() {
      if (props.popupInfo != null) {
    console.log(props.popupInfo.genre.split(" "))
        props.getArcs(props.popupInfo[value].split(","), value)
        props.setArcsLoaded(true)
      } else {
          console.log('No selected')
          props.setArcsLoaded(false)
      }
  }

/*   function getArcs(values, selection) {

    fetch('http://localhost:3001/genre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({values, selection}),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data)
      });
  } */
if (props.popupInfo != null) {

  function createDate(datestr) {
    if (datestr != null) {
    let releaseDate = new Date(datestr)
    let formDate = releaseDate.toISOString().split('T')[0];
    return formDate
    } else {
      return 'Not Found'
    }


  }
  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Extra Info
      </Typography>

      <div className="pop-info">
      <div className="pop-top-info">
      <a href={`https://en.wikipedia.org${props.popupInfo.href}`}>
      <img className="pop-image" width={150} height={150} src={props.popupInfo.image} />
      </a>
      <div className="song-stats">
            <div className="pop-title"> {props.popupInfo.title}</div>


            <div className="pop-subtitle"><span className="pop-span">Album : </span>{String(props.popupInfo.album).trim()}</div>


            <div className="pop-subtitle"><span className="pop-span">Genre : </span>{String(props.popupInfo.genre).trim().toLocaleLowerCase()}</div>
            <div className="pop-subtitle"><span className="pop-span">Artist : </span>{String(props.popupInfo.songwriters).trim().toLocaleLowerCase()}</div>
            <div className="pop-subtitle"><span className="pop-span">Producers : </span>{String(props.popupInfo.producers).trim().toLocaleLowerCase()}</div>

            <div className="pop-subtitle"><span className="pop-span">Released : </span> {createDate(props.popupInfo.released)}</div>
            </div>
            
</div>
            <div className="pop-stats">
           <div className="small-stat"><span className="small-pop-span">Acousticness: </span> {props.popupInfo.acousticness}</div>
           <div className="small-stat"><span className="small-pop-span">Energy : </span> {props.popupInfo.energy}</div>
           <div className="small-stat"><span className="small-pop-span">Valence : </span> {props.popupInfo.valence}</div>
           <div className="small-stat"><span className="small-pop-span">Instrumentalness : </span> {props.popupInfo.instrumentalness}</div>
           <div className="small-stat"><span className="small-pop-span">Danceability : </span> {props.popupInfo.danceability}</div>
        
           <div className="small-stat"><span className="small-pop-span">Key : </span> {props.popupInfo.music_key}</div>
           <div className="small-stat"><span className="small-pop-span">Mode : </span> {props.popupInfo.music_mode}</div>
           <div className="small-stat"><span className="small-pop-span">Loudness : </span> {props.popupInfo.loudness}</div>

           <div className="small-stat"><span className="small-pop-span">Time Signature : </span> {props.popupInfo.time_signature}</div>
           <div className="small-stat"><span className="small-pop-span">Duration : </span> {Number(props.popupInfo.duration_ms) / 1000} s</div>

            </div>
           
    
         
          </div>
      <div className="arc-controls">
      <select
      className="arc-select"
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

        <button className ="small-choose-button" onClick={() => checkGenre()}>find connections</button>
</div>
    </div>
  );
          } else {
            return (
              <div className="song-selected">
              No Song Selected
              </div>
            )
          }
}

