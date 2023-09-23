import React from 'react';
import "./Home.css";
import { Sobre } from '../components/home/Sobre';
import { Principal } from '../components/home/Principal';

export const Home = () => {


    return (
        <>
            <Principal />
            <Sobre />
        </>
    );

}