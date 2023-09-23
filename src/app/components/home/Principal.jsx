import React from 'react';
import "./Principal.css";

export const Principal = () => {
    return (
        <div id="header" >
            <h2>CarFixer</h2>
            <p>Não existe veículo ruim, existe veículo que ainda não conheceu o CarFixer.</p>
            <div className="links">
                <button>Conheça nossos serviços</button>
            </div>
        </div>
    );
}