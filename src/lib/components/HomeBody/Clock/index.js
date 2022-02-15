import { useState, useEffect } from "react";
import decorators from "./decorators.module.css";

function Clock({ timezone, datetime }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const tick = setInterval(() => {
      datetime.setSeconds(datetime.getSeconds() + 1);
      setDisplay(
        [
          datetime.getHours(),
          datetime.getMinutes(),
          datetime.getSeconds(),
        ].join(":")
      );
    }, 1000);
    return () => {
      clearInterval(tick);
    };
  }, [datetime]);
  return (
    <div className={decorators.clock}>
      <h2 className={decorators.title}>{timezone}</h2>
      <div className={decorators.display}>{display}</div>
      <div className={decorators.twelve}></div>
      <div className={decorators.three}></div>
      <div className={decorators.six}></div>
      <div className={decorators.nine}></div>
      <div
        className={decorators.hour}
        style={{ transform: `rotate(${(datetime.getHours() * 360) / 12}deg)` }}
      ></div>
      <div
        className={decorators.minute}
        style={{
          transform: `rotate(${(datetime.getMinutes() * 360) / 60}deg)`,
        }}
      ></div>
      <div
        className={decorators.second}
        style={{
          transform: `rotate(${(datetime.getSeconds() * 360) / 60}deg)`,
        }}
      ></div>
    </div>
  );
}

export default Clock;
