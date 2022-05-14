import React, { useState, useEffect, useRef } from 'react';

// https://stackoverflow.com/questions/53024496/state-not-updating-when-using-react-state-hook-within-setinterval
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  let c: any = () => { };
  if (savedCallback && typeof savedCallback.current) {
    c = savedCallback.current;
  }

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // savedCallback.current();
      c();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;