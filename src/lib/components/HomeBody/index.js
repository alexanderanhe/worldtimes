import { useState, useEffect } from "react";
import decorators from "./decorators.module.css";
import Clock from "./Clock";
import useLocalStorage from "./../../../hooks/localStorage";
const WORLD_TIME_API_URL = "http://worldtimeapi.org/api/timezone/";
const AVAILABLE_REGIONS = ["America", "Asia", "Europe"];

/**
 * Represents the main page of the application.
 * @returns {JSX.Element}
 */
function HomeBody() {
  const [worldTimes, setWorldTimes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [clocksStored, setClocksStored] = useLocalStorage("clocks", [
    "America/Mexico_City",
  ]);

  /**
   * Handles the addition of a new clock.
   * @param {object} e - The event which contains the selected value.
   */
  const handleAddNewOne = (event) => {
    setClocksStored([...clocksStored, event.target.value]);
  };

  /**
   * Handles the deletion of a clock.
   * @param {object} e - The event which contains the timezone of the clock to be deleted.
   */
  const handleDelete = (timezone) => () => {
    setClocksStored(clocksStored.filter((country) => country !== timezone));
  };

  useEffect(() => {
    (async () => {
      setWorldTimes(
        await Promise.all(
          clocksStored.map(async (place) => {
            const response = await fetch(`${WORLD_TIME_API_URL}${place}`);
            const { timezone, abbreviation, datetime } = await response.json();
            return {
              timezone,
              abbreviation,
              datetime: new Date(datetime.substring(0, 26)),
            };
          })
        )
      );

      // Fill the select
      setCountries(
        [].concat.apply(
          [],
          await Promise.all(
            AVAILABLE_REGIONS.map(async (region) => {
              const response = await fetch(`${WORLD_TIME_API_URL}${region}`);
              return await response.json();
            })
          )
        )
      );
    })();
  }, [clocksStored]);

  return (
    <>
      <div className={decorators.header}>
        <h1 className={decorators.title}>World Time</h1>
      </div>
      <div className={decorators.forms}>
        <select onChange={handleAddNewOne}>
          <option hidden>Countries</option>
          {countries.map((country, i) => (
            <option key={`${i}_${country}`} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div className={decorators.container}>
        {worldTimes.map((item, i) => (
          <div
            key={`${i}_${item.timezone.replace(" ", "_")}`}
            className={decorators.box}
          >
            {i > 0 && (
              <button
                className={decorators.deleteButton}
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

export default HomeBody;
