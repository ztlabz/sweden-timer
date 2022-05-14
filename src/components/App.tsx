import React, { useEffect, useReducer, useState } from "react";
// import useInterval from "../hooks/use-interval";
import './App.scss';
import ScreenAnalogTimer from "./ScreenAnalogTimer";
import ScreenHome from "./ScreenHome";
import ScreenSetTimer from "./ScreenSetTimer";

/*
ZATHEVI:
Typescript I Sass



*/

let intervalID: any = false;

export const AppContext = React.createContext(null);


const getMinutesSecondsFromMiliseconds = (ms: number) => {
  let minutes = Math.floor(ms / (60 * 1000));
  let seconds = Math.floor((ms - (minutes * (60 * 1000))) / 1000);
  return [minutes, seconds];
};

const App = () => {
  const [refresh, setRefresh] = useState(0); // this state is just for refreshing the screen on every tick

  // timer status
  const OFF = 'OFF';
  const RUNNING = 'RUNNING';
  const BREAK = 'BREAK';
  const ALERTING = 'ALERTING';

  const initialState = {
    status: OFF,
    intervals: false,
    breaks: false,
    minutes: 0,
    milisecondsMax: 0,
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'START_TIMER':
        // const milisecondsStart = Date.now();
        console.log(action)
        console.log('payload minutes', action.payload.minutes)
        console.log('ms max', Date.now() + (action.payload.minutes * (60 * 1000)));
        return {
          ...state,
          intervals: action.payload.intervals,
          breaks: action.payload.breaks,
          minutes: action.payload.minutes,
          milisecondsMax: Date.now() + (action.payload.minutes * (60 * 1000)),
          status: RUNNING
        };

      case 'START_BREAK':
        const fiveMinutes = 5;
        return {
          ...state,
          milisecondsMax: Date.now() + fiveMinutes * (60 * 1000),
          status: BREAK
        };

      case 'REPEAT_TIMER':
        return {
          ...state,
          milisecondsMax: Date.now() + (state.minutes * (60 * 1000)),
          status: RUNNING
        };

      case 'ALERTING':
        return {
          ...state,
          milisecondsMax: 0,
          status: ALERTING
        };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log('satte changed', state.milisecondsMax);
  }, [state.milisecondsMax]);


  // const [timerStatus, setTimerStatus] = useState(RUNNING); // OFF, RUNNING, BREAK, ALERTING



  // const [time, setTime] = useState(0);


  // const x = { ...state };

  const tick = (state: any) => {
    const miliseconds = Date.now();
    // const state = { ...x };
    console.log('state.status', state.status, 'miliseconds', miliseconds);
    if (state.status === RUNNING) {
      if (miliseconds >= state.milisecondsMax) {
        console.log(miliseconds, state.milisecondsMax, miliseconds >= state.milisecondsMax);
        // console.log(state);
        // time is up
        console.log('Time is up!');
        if (state.intervals === true) {
          if (state.breaks === true) {
            dispatch({
              type: 'START_BREAK'
            });
          } else {
            dispatch({
              type: 'REPEAT_TIMER'
            });
          }
        } else {
          dispatch({
            type: 'ALERTING'
          });
        }
      }
    } else if (state.status === BREAK) {
      if (miliseconds >= state.milisecondsMax) {
        // break time is up
        console.log('Break time is up!');
        dispatch({
          type: 'REPEAT_TIMER'
        });
      }
    }

    /*
    setTime((t: any) => {
      return t + 1;
    });
    */

    // REFRESH SCREEN
    setRefresh(refresh => refresh + 1);
  };


  /*
  useEffect(() => {
    // component did mount
    if (!intervalID) {
      intervalID = setInterval(() => {
        // call tick every second
        tick();
      }, 1000);
    }
  }, []);
  */

  useEffect(() => {
    //
    if (intervalID) {
      // console.log('clearing interval');
      // clearInterval(intervalID);
      clearTimeout(intervalID);
    }
    if (state.status === RUNNING || state.status === BREAK) {
      // console.log('new interval');
      intervalID = setTimeout(() => {
        // call tick every second
        tick(state);
      }, 1000);
    }
  }, [tick, state]);

  /*
  useInterval(() => {
    // Your custom logic here    
    tick();
  }, 1000);
  */

  const cbStartTimer = (payload: any) => {
    dispatch({
      type: 'START_TIMER',
      payload: payload
    });
  };

  let milisecondsLeft = 0;
  const delta = state.milisecondsMax - Date.now();
  console.log('***', state.status, delta);
  if (state.status === RUNNING && delta > 0) {
    console.log('delta', delta);
    milisecondsLeft = delta;
  }
  const [minutes, seconds] = getMinutesSecondsFromMiliseconds(milisecondsLeft);


  return (
    <>
      App
      <div className="temp-screens">
        <ScreenHome />
        <ScreenSetTimer cbStartTimer={cbStartTimer} />
        <ScreenAnalogTimer minutes={minutes} seconds={seconds} />
        <ScreenAnalogTimer minutes={minutes} seconds={seconds} />
      </div>
    </>
  );
};

export default App;
