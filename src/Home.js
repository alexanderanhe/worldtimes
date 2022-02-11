import { useState, useEffect } from "react";
import styles from './Home.module.css';
import Clock from './components/Clock';
import useLocalStorage from "./hooks/localStorage";
const WORLDTIMEAPI_URL = "http://worldtimeapi.org/api/timezone/";
const AVAILABLE_REGIONS = ["America", "Asia", "Europe"];

function Home() {
  const [ worldTimes, setWorldTimes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clocksStored, setClocksStored] = useLocalStorage('clocks', [
  "America/Mexico_City",
  ]);

  const handleAddNewOne = (event) => {
    setClocksStored([...clocksStored, event.target.value]);
  };
  const handleDelete = (timezone) => () => {
    setClocksStored(clocksStored.filter((country) => country !== timezone));
  }

  useEffect(() => {
    (async () => {
      setWorldTimes(await Promise.all(clocksStored.map(async (place) => {
        const response = await fetch(`${WORLDTIMEAPI_URL}${place}`);
        const {timezone, abreviation, datetime} = await response.json();
        return {
          timezone,
          abreviation,
          datetime: new Date(datetime.substring(0, 26))
        };
      })));

      // Fill the select
      setCountries([].concat.apply([], await Promise.all(AVAILABLE_REGIONS.map(async (region) => {
        const response = await fetch(`${WORLDTIMEAPI_URL}${region}`);
        return await response.json();
      })) ));
    })();
  }, [clocksStored]);
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>World Time</h1>
      </div>
      <div className={styles.forms}>
        <select onChange={handleAddNewOne}>
          <option hidden>Countries</option>
          {countries.map((country, i) => (
            <option key={`${i}_${country}`} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div className={styles.container}>
        {worldTimes.map((item, i) => (
          <div
            key={`${i}_${item.timezone.replace(" ", "_")}`}
            className={styles.box}
          >
            {i>0 && (
              <button
                className={styles.deleteButton}
                onClick={handleDelete(item.timezone)}
              >
                &times;
              </button>
            )}
            <Clock {...item} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
