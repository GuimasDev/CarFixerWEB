import React from 'react';
import "./Home.css";
import { Sobre } from '../../components/home/Sobre';
import { Principal } from '../../components/home/Principal';
import { Servicos } from '../../components/home/Servicos';
import { Relatorio } from '../../components/home/Relatorio';
import { Agendamento } from '../../components/home/Agendamento';

export const Home = () => {


    return (
        <>
            <Principal />
            <Servicos />
            <Agendamento />
            <Relatorio />
            <Sobre />
        </>
    );

}