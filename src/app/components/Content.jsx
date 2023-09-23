import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Horario } from "../pages/Horario";

export const Content = props => (
    <main className="Content">

        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/horario" element={<Horario />} />
        </Routes>

    </main>
);