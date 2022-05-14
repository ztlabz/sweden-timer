import { useState } from "react";


const ScreenSetTimer = (props: any) => {
  const [minutes, setMinutes] = useState(1);
  const [intervals_, setintervals_] = useState(true);
  const [breaks_, setBreaks_] = useState(true);


  const maxMinutes = 20;

  const handleMinutesPlus = () => {
    setMinutes((state: any) => {
      if (state < maxMinutes) {
        return state + 1;
      }
      return maxMinutes;
    });
  };

  const handleMinutesMinus = () => {
    setMinutes((state: any) => {
      if (state > 1) {
        return state - 1;
      }
      return 1;
    });
  };

  const handleStart = () => {
    if (typeof props.cbStartTimer === 'function') {
      props.cbStartTimer({
        minutes: minutes,
        intervals: intervals_,
        breaks: breaks_
      });
    }
  };

  return (
    <>
      <div className="screen screen-set-timer">
        <h1>Set timer</h1>
        <div className="set-minutes-group">
          <div className="btn-plus-minus" onClick={handleMinutesMinus}>&lt;</div>
          <div className="minutes">{minutes}</div>
          <div className="btn-plus-minus" onClick={handleMinutesPlus}>&gt;</div>
        </div>

        <label>Intervals
          <input type="checkbox" name="intervals_" checked={intervals_} onChange={(e) => { setintervals_(e.target.checked) }} />
        </label>
        <label>5 min. break / interval
          <input type="checkbox" name="breaks_" checked={breaks_} onChange={(e) => { setBreaks_(e.target.checked) }} />
        </label>
        <div className="btn" onClick={handleStart}>START TIMER</div>

      </div>
    </>
  );
};

export default ScreenSetTimer;