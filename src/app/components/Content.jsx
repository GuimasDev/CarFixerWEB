import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const Content = props => (
    <main className="Content">

        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>

    </main>
);