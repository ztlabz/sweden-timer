import React, { useEffect, useReducer, useState } from "react";
import './App.scss';
import ScreenAlarm from "./ScreenAlarm";
import ScreenAnalogTimer from "./ScreenAnalogTimer";
import ScreenBreak from "./ScreenBreak";
import ScreenDigitalTimer from "./ScreenDigitalTimer";
import ScreenHome from "./ScreenHome";
import ScreenMenu from "./ScreenMenu";
import ScreenSetTimer from "./ScreenSetTimer";

/*
ZATHEVI:
Typescript I Sass



*/


const getMinutesSecondsFromMiliseconds = (ms: number) => {
  let minutes = Math.floor(ms / (60 * 1000));
  let seconds = Math.floor((ms - (minutes * (60 * 1000))) / 1000);
  return [minutes, seconds];
};

let intervalID: any = false;


const App = () => {
  const [refresh, setRefresh] = useState(0); // this state is just for refreshing the screen on every tick

  const [menuOpened, setMenuOpened] = useState(false);
  const [mode, setMode] = useState('ANALOG'); // ANALOG/DIGITAL


  // timer status
  const OFF = 'OFF';
  const SETTING = 'SETTING';
  const RUNNING = 'RUNNING';
  const BREAK = 'BREAK';
  const ALARM = 'ALARM';

  const initialState = {
    status: OFF,
    intervals: false,
    breaks: false,
    minutes: 0,
    milisecondsMax: 0,
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'ABORT_TIMER':
        return {
          ...state,
          status: OFF
        };

      case 'SET_NEW_TIMER':
        return {
          ...state,
          status: SETTING
        };

      case 'START_TIMER':
        // const milisecondsStart = Date.now();
        // console.log(action);
        // console.log('payload minutes', action.payload.minutes);
        // console.log('ms max', Date.now() + (action.payload.minutes * (60 * 1000)));
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

      case 'ALARM':
        return {
          ...state,
          milisecondsMax: 0,
          status: ALARM
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const tick = (state: any) => {
    const miliseconds = Date.now();
    console.log('state.status', state.status, 'miliseconds', miliseconds);
    if (state.status === RUNNING) {
      if (miliseconds >= state.milisecondsMax) {
        console.log(miliseconds, state.milisecondsMax, miliseconds >= state.milisecondsMax);
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
            type: 'ALARM'
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

    // REFRESH SCREEN
    setRefresh(refresh => refresh + 1);
  };

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


  // PREPARING DATA FOR SCREENS

  const cbSetMode = (x: any) => {
    setMode(x);
    setMenuOpened(false);
  };

  const cbMenuToggle = () => {
    setMenuOpened(opened => {
      if (opened) {
        return false;
      }
      return true;
    });
  };

  const cbSetNewTimer = () => {
    dispatch({
      type: 'SET_NEW_TIMER'
    });
  };

  const cbStartTimer = (payload: any) => {
    dispatch({
      type: 'START_TIMER',
      payload: payload
    });
  };

  const cbAbortTimer = (payload: any) => {
    dispatch({
      type: 'ABORT_TIMER',
      payload: payload
    });
  };

  const cbAbortBreak = () => {
    dispatch({
      type: 'REPEAT_TIMER'
    });
  };

  // calculate minutes and seconds to display
  let milisecondsLeft = 0;
  const delta = state.milisecondsMax - Date.now();
  console.log('***', state.status, delta);
  if ((state.status === RUNNING || state.status === BREAK) && delta > 0) {
    console.log('delta', delta);
    milisecondsLeft = delta;
  }
  const [minutes, seconds] = getMinutesSecondsFromMiliseconds(milisecondsLeft);


  let headerTitle = 'timer';
  if (state.intervals === true) {
    headerTitle = 'interval';
  }

  let jsxScreen = null;
  if (state.status === OFF) {
    jsxScreen = (
      <ScreenHome cbSetNewTimer={cbSetNewTimer} cbMenuToggle={cbMenuToggle} />
    );
  } else if (state.status === SETTING) {
    jsxScreen = (
      <ScreenSetTimer cbStartTimer={cbStartTimer} cbMenuToggle={cbMenuToggle} />
    );
  } else if (state.status === RUNNING) {
    if (mode === 'DIGITAL') {
      jsxScreen = (
        <ScreenDigitalTimer minutes={minutes} seconds={seconds} cbAbortTimer={cbAbortTimer} headerTitle={headerTitle} cbMenuToggle={cbMenuToggle} />
      );
    } else {
      jsxScreen = (
        <ScreenAnalogTimer minutes={minutes} seconds={seconds} cbAbortTimer={cbAbortTimer} headerTitle={headerTitle} cbMenuToggle={cbMenuToggle} />
      );
    }
  } else if (state.status === ALARM) {
    jsxScreen = (
      <ScreenAlarm cbSetNewTimer={cbSetNewTimer} cbMenuToggle={cbMenuToggle} />
    );
  } else if (state.status === BREAK) {
    jsxScreen = (
      <ScreenBreak minutes={minutes} seconds={seconds} cbAbortBreak={cbAbortBreak} cbMenuToggle={cbMenuToggle} />
    );
  }

  return (
    <>
      <div className="screen-wrapper">
        {jsxScreen}
        <div className={menuOpened ? "menu-container opened" : "menu-container"}>
          {
            menuOpened && (
              <ScreenMenu cbSetMode={cbSetMode} cbMenuToggle={cbMenuToggle} />
            )
          }
        </div>
      </div>
      {/*
      <div className="temp-screens">
        <ScreenHome cbSetNewTimer={cbSetNewTimer} cbMenuToggle={cbMenuToggle} />
        <ScreenSetTimer cbStartTimer={cbStartTimer} cbMenuToggle={cbMenuToggle} />
        <ScreenAnalogTimer minutes={minutes} seconds={seconds} headerTitle={headerTitle} cbMenuToggle={cbMenuToggle} />
        <ScreenDigitalTimer minutes={minutes} seconds={seconds} headerTitle={headerTitle} cbMenuToggle={cbMenuToggle} />
        <ScreenAlarm cbSetNewTimer={cbSetNewTimer} cbMenuToggle={cbMenuToggle} />
        <ScreenBreak minutes={minutes} seconds={seconds} cbAbortBreak={cbAbortBreak} cbMenuToggle={cbMenuToggle} />
      </div>
      */}
    </>
  );
};

export default App;
