import { useState, useEffect } from "react";
import styles from "./Clock.module.css";

function Clock({ timezone, datetime }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const tick = setInterval(() => {
      datetime.setSeconds( datetime.getSeconds() + 1 );
      setDisplay([
        datetime.getHours(),
        datetime.getMinutes(),
        datetime.getSeconds()
      ].join(":"));
    }, 1000);
    return () => {
      clearInterval(tick);
    }
  }, [datetime]);
  return (
    <div className={styles.clock}>
      <h2 className={styles.title}>{timezone}</h2>
      <div className={styles.display}>{display}</div>
      <div className={styles.twelve}></div>
      <div className={styles.three}></div>
      <div className={styles.six}></div>
      <div className={styles.nine}></div>
      <div
        className={styles.hour}
        style={{transform: `rotate(${datetime.getHours() * 360 / 12}deg)`}}
      ></div>
      <div
        className={styles.minute}
        style={{transform: `rotate(${datetime.getMinutes() * 360 / 60}deg)`}}
      ></div>
      <div
        className={styles.second}
        style={{transform: `rotate(${datetime.getSeconds() * 360 / 60}deg)`}}
      ></div>
    </div>
  )
}

export default Clock;
