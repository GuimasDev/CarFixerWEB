import React, { useEffect, useState } from "react";
import styles from "./Horario.module.css";

import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {
    RegraFuncionamentoService,
    IRegraFuncionamento,
} from "../services/api/regraFuncionamento/RegraFuncionamentoService";
import { ApiException } from "../services/api/ApiException";
import { UsuarioService } from "../services/api/usuario/UsuarioService";
import { useNavigate } from "react-router-dom";

export const Horario = () => {
    const [regraList, setRegraList] = useState<IRegraFuncionamento[]>([]);

    const [isNovaRegra, setNovaRegra] = useState(false);
    const [checkboxDias, setCheckboxDias] = useState<number[]>();

    const [hrInicio, setHrInicio] = useState<string>();
    const [hrTermino, setHrTermino] = useState<string>();

    const [needReloadRegraList, setNeedReloadRegraList] = useState<boolean>(false); // acionar useEffect

    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    let diasSemanaDefinidos = loadDiasSemanaDefinidos(regraList) || [];

    useEffect(() => {
        RegraFuncionamentoService.get().then(result => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setRegraList(result);
            }
            // console.log(result);
        });

        setNeedReloadRegraList(false);
    }, [needReloadRegraList]);

    const adicionarNovaRegra = () => {
        let hr_inicio = hrInicio;
        let hr_termino = hrTermino;
        let diasInt = checkboxDias;

        if (hr_termino != null && hr_inicio != null && diasInt != undefined && diasInt.length > 0) {
            let novaRegra = new Regra();
            novaRegra.dias = diasInt.toString().replace(",", "");
            novaRegra.diasInt = diasInt;
            novaRegra.hr_inicio = hr_inicio;
            novaRegra.hr_termino = hr_termino;

            setNovaRegra(false);
            setCheckboxDias([]);

            RegraFuncionamentoService.create(novaRegra).then(result => {
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    alert("Salvo com sucesso!!");
                    setNeedReloadRegraList(true);
                }
                // console.log(result);
            });
        } else {
            alert(
                "É preciso selecionar pelo menos 1 dia e denfinir o horário de início de termino do antedimento!!"
            );
        }
    };

    const cancelarNovaRegra = () => {
        setNovaRegra(false);
        setCheckboxDias([]);
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

        // console.log(checkboxDias);
    };

    const removerRegra = (regraId: number) => {
        RegraFuncionamentoService.deleteById(regraId).then(result => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setNeedReloadRegraList(true);
            }
        });
    };

    return (
        <div id="container">
            <h1>Horários de Funcionamento</h1>
            {regraList.length === 0 && !isNovaRegra ? <p id="message">Nenhuma regra adicionada!</p> : <></>}

            {regraList.map((element, i) => {
                return (
                    <div className={styles.card} key={i}>
                        <Row>
                            <Col className={styles.colDias}>
                                {element.diasInt.map((dia, i) => {
                                    return (
                                        <p className={styles.diaArea} key={i}>
                                            {diasSemana[dia]}
                                        </p>
                                    );
                                })}
                            </Col>
                            <Col className={styles.colHorarios}>
                                <div className={styles.horarioRowGroup}>
                                    <div className={styles.horarioRow}>
                                        <p>Início de atendimento:</p>
                                        <input
                                            disabled
                                            type="time"
                                            className={styles.inputHoras}
                                            value={element.hr_inicio}
                                            onChange={e => setHrInicio(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.horarioRow}>
                                        <p>Termino de atendimento:</p>
                                        <input
                                            disabled
                                            type="time"
                                            className={styles.inputHoras}
                                            value={element.hr_termino}
                                            onChange={e => setHrTermino(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.btnApagarArea}>
                                    <button className={styles.apagarButton} onClick={_ => removerRegra(element.id)}>
                                        Remover
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            })}

            {isNovaRegra && diasSemanaDefinidos.length < 7 && (
                <div className={styles.card}>
                    <Row>
                        <Col className={styles.colDias}>
                            {diasSemana.map((dia, i) => {
                                if (!diasSemanaDefinidos.includes(i)) {
                                    return (
                                        <Form.Check
                                            key={i}
                                            type={"checkbox"}
                                            id={"formCheck" + i}
                                            value={i}
                                            onChange={event => handleCheckboxChange(event)}
                                            className={styles.diaArea2}
                                            label={diasSemana[i]}
                                        />
                                    );
                                } else {
                                    return <></>;
                                }
                            })}
                        </Col>
                        <Col className={styles.colHorarios}>
                            <div className={styles.horarioRowGroup}>
                                <div className={styles.horarioRow}>
                                    <p>Início de atendimento:</p>
                                    <input
                                        id="hr_inicio"
                                        type="time"
                                        className={styles.inputHoras}
                                        onChange={e => setHrInicio(e.target.value)}
                                    />
                                </div>
                                <div className={styles.horarioRow}>
                                    <p>Termino de atendimento:</p>
                                    <input
                                        id="hr_termino"
                                        type="time"
                                        className={styles.inputHoras}
                                        onChange={e => setHrTermino(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.buttonArea2}>
                                <button className={styles.cancelarButton} onClick={_ => cancelarNovaRegra()}>
                                    Cancelar
                                </button>
                                <button className={styles.adicionarRegraButton} onClick={_ => adicionarNovaRegra()}>
                                    Adicionar
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            <div className={styles.buttonArea}>
                <button className={styles.voltarButton} onClick={_ => (window.location.href = "/")}>
                    Voltar
                </button>
                {!isNovaRegra && diasSemanaDefinidos.length < 7 ? (
                    <button className={styles.novaRegraButton} onClick={_ => setNovaRegra(true)}>
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
        diasDefinidos = diasDefinidos.concat(regra.diasInt);
    });

    diasDefinidos = diasDefinidos.sort();
    return diasDefinidos;
}

class Regra implements IRegraFuncionamento {
    id: number;
    dias: string;
    diasInt: number[];
    hr_inicio: string;
    hr_termino: string;

    constructor() {
        this.id = 0;
        this.dias = "";
        this.diasInt = [];
        this.hr_inicio = "";
        this.hr_termino = "";
    }
}
