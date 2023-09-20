import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";

export const Content = props => (
    <main className="Content">

        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/" element={<Home />} />
        </Routes>

    </main>
);