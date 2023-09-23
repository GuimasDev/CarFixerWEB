import React, { useState } from "react";
import "./Horario.css";

import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { string } from "yargs";

export const Horario = () => {
    const [regraList, setRegraList] = useState<Regra[]>([
        {
            id: 1,
            dias: [1, 2, 3, 4],
            hr_inicio: "07:30",
            hr_termino: "18:30",
        },
        {
            id: 2,
            dias: [0, 5],
            hr_inicio: "10:20",
            hr_termino: "15:30",
        },
    ]);

    const [isNovaRegra, setNovaRegra] = useState(false);
    const [checkboxDias, setCheckboxDias] = useState<number[]>();

    const [hrInicio, setHrInicio] = useState<string>();
    const [hrTermino, setHrTermino] = useState<string>();

    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    let diasSemanaDefinidos = loadDiasSemanaDefinidos(regraList) || [];

    let adicionarNovaRegra = () => {
        let hr_inicio = hrInicio;
        let hr_termino = hrTermino;
        let dias = checkboxDias;

        console.log("será adicionado:");
        console.log({
            dias: dias!,
            hr_inicio: hr_inicio!,
            hr_termino: hr_termino!,
        });

        if (hr_termino != null && hr_inicio != null && dias != undefined && dias.length > 0) {
            let novaRegra = new Regra();
            novaRegra.id = regraList.length;
            novaRegra.dias = dias;
            novaRegra.hr_inicio = hr_inicio;
            novaRegra.hr_termino = hr_termino;

            setRegraList([...regraList, novaRegra]);
            setNovaRegra(false);
            setCheckboxDias([]);

            console.log("adicionado:");
            console.log({
                dias: dias!,
                hr_inicio: hr_inicio!,
                hr_termino: hr_termino!,
            });
        }
        console.log("Erro ao adicionar nova regra!");
    };

    const handleCheckboxChange = (event: any) => {
        const target = event.target;
        const checked = target.checked;
        const value = target.value;

        if (checked === true) {
            let bool = checkboxDias || [];
            bool.push(Number(value));
            setCheckboxDias(bool.sort());
        } else {
            let bool = checkboxDias || [];
            if (bool.includes(Number(value))) {
                bool = bool.filter(num => num !== Number(value));
                setCheckboxDias(bool.sort());
            }
        }

        console.log(checkboxDias);
    };

    const removerRegra = (regraId: number) => {
        let auxList = regraList;
        setRegraList(auxList.filter(r => r.id !== regraId));
    };

    return (
        <div id="container">
            <h1>Horários de Atendimento</h1>
            {regraList.length === 0 && !isNovaRegra ? <p id="message">Nenhuma regra adicionada!</p> : <></>}

            {regraList.map((element, i) => {
                return (
                    <div className="card" key={i}>
                        <Row>
                            <Col className="colDias">
                                {element.dias.map(dia => {
                                    return <p className="diaArea">{diasSemana[dia]}</p>;
                                })}
                            </Col>
                            <Col className="colHorarios">
                                <div className="horarioRowGroup">
                                    <div className="horarioRow">
                                        <p>Início de atendimento:</p>
                                        <input
                                            type="time"
                                            className="inputHoras"
                                            value={element.hr_inicio}
                                            onChange={e => setHrInicio(e.target.value)}
                                        />
                                    </div>
                                    <div className="horarioRow">
                                        <p>Termino de atendimento:</p>
                                        <input
                                            type="time"
                                            className="inputHoras"
                                            value={element.hr_termino}
                                            onChange={e => setHrTermino(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="btnApagarArea">
                                    <button className="apagarButton" onClick={_ => removerRegra(element.id)}>
                                        Remover
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            })}

            {isNovaRegra && diasSemanaDefinidos.length < 7 && (
                <div className="card">
                    <Row>
                        <Col className="colDias">
                            {diasSemana.map((dia, i) => {
                                if (!diasSemanaDefinidos.includes(i)) {
                                    return (
                                        <Form.Check
                                            type={"checkbox"}
                                            id={"formCheck" + i}
                                            value={i}
                                            onChange={event => handleCheckboxChange(event)}
                                            className="diaArea2 formCheck"
                                            label={diasSemana[i]}
                                        />
                                    );
                                } else {
                                    return <></>;
                                }
                            })}
                        </Col>
                        <Col className="colHorarios">
                            <div>
                                <div className="horarioRow">
                                    <p>Início de atendimento:</p>
                                    <input
                                        id="hr_inicio"
                                        type="time"
                                        className="inputHoras"
                                        onChange={e => setHrInicio(e.target.value)}
                                    />
                                </div>
                                <div className="horarioRow">
                                    <p>Termino de atendimento:</p>
                                    <input
                                        id="hr_termino"
                                        type="time"
                                        className="inputHoras"
                                        onChange={e => setHrTermino(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="buttonArea2">
                                <button className="cancelarButton" onClick={_ => setNovaRegra(false)}>
                                    Cancelar
                                </button>
                                <button className="adicionarRegraButton" onClick={_ => adicionarNovaRegra()}>
                                    Adicionar
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="buttonArea">
                <Button variant="outline-primary" onClick={_ => (window.location.href = "/")}>
                    Voltar
                </Button>
                {!isNovaRegra && diasSemanaDefinidos.length < 7 ? (
                    <button className="novaRegraButton" onClick={_ => setNovaRegra(true)}>
                        Nova Regra
                    </button>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

function loadDiasSemanaDefinidos(regraList: Regra[]) {
    let diasDefinidos: number[];
    diasDefinidos = [];
    regraList.forEach(regra => {
        diasDefinidos = diasDefinidos.concat(regra.dias);
    });

    diasDefinidos = diasDefinidos.sort();
    return diasDefinidos;
}

class Regra {
    id: number;
    dias: number[];
    hr_inicio: string;
    hr_termino: string;

    constructor() {
        this.id = 0;
        this.dias = [];
        this.hr_inicio = "";
        this.hr_termino = "";
    }
}


/**
 * Fazer com que os inputs das regras sejam editaveis, onChange chama funcao que edita a regra no banco
 * os dias, ao ser Hover, aparecerá opção pra remover o dia
 * 
 * Fazer aviso pra quando nova regra não é adicionada
 */