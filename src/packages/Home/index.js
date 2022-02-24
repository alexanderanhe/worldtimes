import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClockItem from "../../lib/components/ClockItem";
import { HomeBody } from "./../../lib/components";

/**
 * Represents the Home page.
 * @returns {JSX.Element}
 */
const Home = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomeBody />} />
                <Route exact path="/region/:region" element={<ClockItem />} />
            </Routes>
        </Router>
    )
};

export default Home;