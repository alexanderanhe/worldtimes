import React, { createContext, useContext, useReducer } from "react";
import Reducer from "./reducer";
import useLocalStorage from "../hooks/localStorage";

const AppContext = createContext([[],() => {}]);

export function AppContextProvider({ children }) {
  const [ clocks, setClocks ] = useLocalStorage("clocks", [
    "America/Mexico_City",
  ]);
  const initialState = {
    clocks, setClocks
  };

  return (
    <AppContext.Provider value={useReducer(Reducer, initialState)}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
