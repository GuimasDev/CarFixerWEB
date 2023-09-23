import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Horario } from "../pages/Horario";
import { Login } from "../pages/Login";
import { Logout } from "../pages/Logout";

export const Content = props => (
    <main className="Content">
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/horario" element={<Horario />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
        </Routes>
    </main>
);