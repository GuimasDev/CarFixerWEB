import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { Horario } from "../pages/Horario";
import { Cronograma } from "../pages/Cronograma";
import { Login } from "../pages/usuario/Login";
import { Logout } from "../pages/usuario/Logout";
import { Signin } from "../pages/usuario/Signin";
import { Veiculo } from "../pages/veiculo/Veiculo";
import { Add_Veiculo } from "../pages/veiculo/Add_Veiculo";
import { Agendamento } from "../pages/agenda/Agendamento";
import { Agendar } from "../pages/agenda/Agendar";

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
            <Route path="/agendamentos" element={<Agendamento />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/horario" element={<Horario />} />
            <Route path="/cronograma" element={<Cronograma />} />
        </Routes>
    </main>
);