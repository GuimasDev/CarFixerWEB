import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Logout } from "../pages/Logout";
import { Signin } from "../pages/Signin";
import { Veiculo } from "../pages/Veiculo";
import { Add_Veiculo } from "../pages/Add_Veiculo";
import { Horario } from "../pages/Horario";


export const Content = props => (
    <main className="Content">
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/veiculo" element={<Veiculo />} />
            <Route path="/add-veiculo" element={<Add_Veiculo />} />
            <Route path="/add-veiculo/:id" element={<Add_Veiculo />} />
            <Route path="/horario" element={<Horario />} />
        </Routes>
    </main>
);