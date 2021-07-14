import React, { useState } from "react";
import axios from "axios";

import { Container, Button, Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//import "./Weather.css";
import env from "react-dotenv";

//const rapidapikey = process.env.RAPIDAPI_KEY;

const useStyles = makeStyles(() => ({
  card: {
    margin: 1,
    padding: 2,
    maxHeight: 400,
    maxWidth: "30%",
    fontFamily: "Quicksand, sans-serif",
  },
  paper: {
    padding: 8,
    height: 140,
    width: 120,
  },
}));

function App() {
  let [responseObj, setResponseObj] = useState({});

  let [error, setError] = useState("");
  let [loading, setLoading] = useState(false);
  const classes = useStyles();

  const getForecast = () => {
    setError(false);
    setResponseObj({});

    setLoading(true);

    const options = {
      method: "GET",
      url: "https://community-open-weather-map.p.rapidapi.com/forecast/daily",
      params: { q: "brisbane, australia", cnt: "7", units: "metric" },
      headers: {
        "x-rapidapi-key": env.RAPIDAPI_KEY,
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setResponseObj(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("An error has occured");
        setLoading(false);
        console.log(err.message);
      });
  };

  // convert the day of the week to a string
  const toDateTime = (secs) => {
    var epoch = new Date(1970, 0, 1); // Epoch
    epoch.setSeconds(secs);
    var dayNum = epoch.getDay();
    var theDay = "";
    if (dayNum === 0) {
      theDay = "Sunday";
    } else if (dayNum === 1) {
      theDay = "Monday";
    } else if (dayNum === 2) {
      theDay = "Tuesday";
    } else if (dayNum === 3) {
      theDay = "Wednesday";
    } else if (dayNum === 4) {
      theDay = "Thursday";
    } else if (dayNum === 5) {
      theDay = "Friday";
    } else if (dayNum === 6) {
      theDay = "Saturday";
    }
    return theDay;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container>
        <Typography variant="h5" gutterBottom>
          Find Current Weather Conditions
        </Typography>
        {responseObj.city?.name}
        <Typography></Typography>
        <Button color="primary" onClick={() => getForecast()}>
          Load weather data
        </Button>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {responseObj.list &&
                responseObj.list.map((day) => (
                  <Grid key={day.dt} item>
                    <Paper className={classes.paper}>
                      <Typography>{toDateTime(day.dt)}</Typography>
                      <Typography>{day.temp.day}</Typography>
                      <Typography>{day.weather[0].description}</Typography>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <div>
        {/* <h4>Complete json response:</h4>
        <p>{JSON.stringify(responseObj)}</p> */}
        {/* <Button color="secondary" onClick={() => JSON.stringify(responseObj)}>
          Show raw JSON from API
      </Button>*/}
        {/* <Typography>{JSON.stringify(responseObj)}</Typography> */}
      </div>
    </div>
  );
}

export default App;
