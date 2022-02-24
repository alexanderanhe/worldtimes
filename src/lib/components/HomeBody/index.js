import { useState, useRef, useEffect } from "react";
import { useAppContext } from '../../../context/AppContext';
import decorators from "./decorators.module.css";
import Clock from "./Clock";
const WORLD_TIME_API_URL = "http://worldtimeapi.org/api/timezone/";

/**
 * Represents the main page of the application.
 * @returns {JSX.Element}
 */
function HomeBody() {
  const [worldTimes, setWorldTimes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const input = useRef();
  const [{ clocks: clocksStored }, dispatch] = useAppContext();

  /**
   * Handles the addition of a new clock.
   * @param {string} country - The strings which contains the selected value.
   */
  const handleAddNewOne = (country) => () => {
    dispatch({ type: "ADD_CLOCK", payload: { country }});
    setSearch("");
    if (input) {
      input.current.value = "";
      input.current.focus();
    }
  };

  /**
   * Handles the deletion of a clock.
   * @param {object} e - The event which contains the timezone of the clock to be deleted.
   */
  const handleDelete = (timezone) => () => {
    dispatch({ type: "DELETE_CLOCK", payload: { timezone }});
  };

  /**
   * Handles state of input's value.
   * @param {object} e - The event which contains the current input's value.
   */
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  /**
   * Handles the filtering countries.
   * @param {object} e - The event which contains the timezone of the clock to be deleted.
   */
  const filteredCountries = countries.filter((country) => {
    return country.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    (async () => {
      // I have an error
      console.log(clocksStored);
      if (!clocksStored) return;
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
    })();
  }, [clocksStored]);

  useEffect(() => {
    (async () => {
      // Fill the select
      const response = await fetch(`${WORLD_TIME_API_URL}`);
      setCountries(await response.json());
    })();
  }, []);

  return (
    <>
      <div className={decorators.header}>
        <h1 className={decorators.title}>World Time</h1>
      </div>
      <div className={decorators.forms}>
        <input type="text" onChange={handleSearch} ref={input} />
        <ul>
          {search && filteredCountries.map((country, i) => (
            <li key={`${i}_${country}`} onClick={handleAddNewOne(country)}>
              {country}
            </li>
          ))}
        </ul>
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
