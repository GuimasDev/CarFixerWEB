import React from "react";
import './Content.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { Horario } from "../pages/Horario";
import { Cronograma } from "../pages/Cronograma";
import { Login } from "../pages/usuario/Login";
import { Logout } from "../pages/usuario/Logout";
import { Signup } from "../pages/usuario/Signup";
import { Clientes } from "../pages/cliente/Clientes";
import { Cliente } from "../pages/cliente/Cliente";
import { Veiculo } from "../pages/veiculo/Veiculo";
import { Add_Veiculo } from "../pages/veiculo/Add_Veiculo";
import { Agendamento } from "../pages/agenda/Agendamento";
import { Agendar } from "../pages/agenda/Agendar";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { Produtos } from "../pages/produto/Produtos";
import { Produto } from "../pages/produto/Produto";

export const Content = props => (
    <main className="Content">
        <Routes>
            <Route path="/" exact element={<Home />} />

            {/* Redireciona o usuario para a home page se ja estiver logado */}
            <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Redireciona o usuario para a home page se não estiver logado */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/logout" element={<Logout />} />
                <Route path="/veiculos" element={<Veiculo />} />
                <Route path="/add-veiculo" element={<Add_Veiculo />} />
                <Route path="/add-veiculo/:id" element={<Add_Veiculo />} />
                <Route path="/agendamentos" element={<Agendamento />} />
                <Route path="/agendar" element={<Agendar />} />
                <Route path="/agendar/:id" element={<Agendar />} />

                <Route element={<AdminRoutes />}>
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/cliente" element={<Cliente />} />
                    <Route path="/cliente/:id" element={<Cliente />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/produto/:id" element={<Produto />} />
                    <Route path="/horario" element={<Horario />} />
                    <Route path="/cronograma" element={<Cronograma />} />
                </Route>
            </Route>
        </Routes>
    </main>
);