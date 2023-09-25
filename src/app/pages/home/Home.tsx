import React from 'react';
import "./Home.css";
import { Sobre } from '../../components/home/Sobre';
import { Principal } from '../../components/home/Principal';
import { Servicos } from '../../components/home/Servicos';

export const Home = () => {


    return (
        <>
            <Principal />
            <Servicos />
            <Sobre />

        </>
    );

}