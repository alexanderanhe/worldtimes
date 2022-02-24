export default function Reducer(state, action) {
  // const [_, setClocksStored] = useLocalStorage("clocks", [
  //   "America/Mexico_City",
  // ]);
  switch (action.type) {
    case "ADD_CLOCK":
      const { country } = action.payload;
      const addClocks = [...state.clocks, country];
      if (state.clocks.includes(country)) return;
      state.setClocks(addClocks);
      return addClocks;
    case "DELETE_CLOCK":
      const { timezone } = action.payload;
      const removedClocks = state.clocks.filter((country) => country !== timezone);
      state.setClocks(removedClocks);
      return removedClocks;
    default:
      return state;
  }
}
