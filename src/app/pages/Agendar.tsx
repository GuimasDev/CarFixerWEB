import React, { useEffect, useState } from 'react';
import "./Agendar.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { AgendaService, IAgenda, Status } from '../services/api/agenda/AgendaService';
import { ApiException } from '../services/api/ApiException';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { UsuarioService } from '../services/api/usuario/UsuarioService';
import { IVeiculo, VeiculoService } from '../services/api/veiculo/VeiculoService';
import { HorarioService, IHorario } from '../services/api/horario/HorarioService';
import { IServico, ServicoService } from '../services/api/servico/ServicoService';

export const Agendar = () => {
    const [agenda, setAgenda] = useState<IAgenda>({
        id: 0,
        id_horario: 0,
        id_veiculo: 0,
        status: Status.Pendente,
        observacao: '',
        dt_previsao: undefined,
        dt_fim: undefined,
        produtos: []
    })

    const [id_horario, setId_Horario] = useState(0);
    const [id_veiculo, setId_Veiculo] = useState(0);
    const [status, setStatus] = useState(Status.Pendente);
    const [observacao, setObservacao] = useState('');
    const [dt_previsao, setDt_Previsao] = useState<Date>();
    const [dt_fim, setDt_Fim] = useState<Date>();

    const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
    const [servicos, setServicos] = useState<IServico[]>([]);
    const [addedServicos, setAddedServicos] = useState<IServico[]>([]);

    const [updateList, setUpdateList] = useState<boolean>(false);

    const [horariosDisponiveis, setHorariosDisponiveis] = useState<IHorario[]>([]);
    const [horariosOcupados, setHorariosOcupados] = useState<IHorario[]>([]);

    // setando de forma implicita definições da tabela independente que ainda não foi implementada:
    const horario_rangeMin: Date = new Date();
    const horario_rangeMax: Date = new Date();
    horario_rangeMin.setHours(10);
    horario_rangeMax.setHours(18);
    const horasPorAgendamento: number = 1;
    //**** */

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        VeiculoService.getByUsuario(UsuarioService.getLogin().id as number).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setVeiculos(result);
            }
        });

        setUpdateList(false);
    }, [updateList])

    useEffect(() => {
        if (id !== undefined) {
            AgendaService.getById(parseInt(id)).then((result) => {
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    setAgenda(result);
                    setStatus(result.status);
                    setObservacao(result.observacao);
                    setDt_Previsao(result.dt_previsao);
                }
            })
        }
    }, [])

    useEffect(() => {
        ServicoService.get().then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setServicos(result);
            }
        });
    }, [])

    useEffect(() => {
        HorarioService.get().then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setHorariosOcupados(result);
            }
        });
    }, [])

    function calcularHorarios(dia: Date) {
        let horarios: IHorario[] = [];
        let horasTotal =
            horario_rangeMax.getHours() - horario_rangeMin.getHours();

        for (
            let horasTrabalhando = 0;
            horasTrabalhando < horasTotal;
            horasTrabalhando += horasPorAgendamento
        ) {
            let horas = horario_rangeMin.getHours() + horasTrabalhando;
            dia.setHours(horas);

            let horario = new IHorario(new Date(dia));
            horarios.push(horario);
        }

        return horarios;
    }

    function loadHorariosDisponiveisPorDia() {
        let dataHTML: any = document.getElementById('inputData');
        console.log(dataHTML);
        let dataString = dataHTML.value;
        let diaSelecionado = new Date(dataString);
        diaSelecionado.setDate(diaSelecionado.getDate() + 1);
        let horariosDoDia = calcularHorarios(diaSelecionado);

        for (let i = 0; i < horariosDoDia.length; i++) {
            for (let z = 0; z < horariosOcupados.length; z++) {
                console.log(3);
                let horarioOcupado = horariosOcupados[z];
                // console.log('horarioOcupado.data :');
                // console.log(horarioOcupado);

                // let val1 = horariosDoDia[i].data;
                let val1 = new Date(
                    horariosDoDia[i].data.getTime() +
                    horariosDoDia[i].data.getTimezoneOffset() * 60000
                );
                let val2 = new Date(horarioOcupado.data);
                // const dataHoraUtc = new Date(dataHora.getTime() + (dataHora.getTimezoneOffset() * 60000));

                let objVal1 = {
                    year: val1.getFullYear(),
                    month: val1.getMonth(), // lembrando q vai de 0 a 11
                    day: val1.getDate(),
                    hour: val1.getHours(),
                    minute: val1.getMinutes(),
                    second: val1.getSeconds(),
                };
                let objVal2 = {
                    year: val2.getUTCFullYear(),
                    month: val2.getUTCMonth(),
                    day: val2.getUTCDate(),
                    hour: val2.getUTCHours(),
                    minute: val2.getUTCMinutes(),
                    second: val2.getUTCSeconds(),
                };

                if (objVal1.month === objVal2.month) {
                    if (objVal1.day === objVal2.day) {
                        if (objVal1.hour === objVal2.hour) {
                            if (objVal1.minute === objVal2.minute) {
                                horariosDoDia[i].status = horarioOcupado.status;
                                console.log('horarios iguais: ');
                                console.log(objVal1);
                                console.log(objVal2);
                            }
                        }
                    }
                }
            }
        }

        console.log(horariosDoDia);
        setHorariosDisponiveis(horariosDoDia);
    }

    function addServico() {
        let select: any = document.getElementById('servico');
        let idService = select.value;

        if (select.value > 0) {
            ServicoService.getById(parseFloat(idService)).then((result: any) => {
                addedServicos.push(result);
                setServicos(servicos.filter(({ id }) => id != idService));
            });
        }

        select.value = '';
    }

    function removeServico(servico: IServico) {
        setAddedServicos(addedServicos.filter(
            ({ id }) => id != servico.id
        ));
        servicos.push(servico);
    }

    const handleSubmit = async () => {
        let agenda: Omit<IAgenda, 'id'> = {
            id_horario: id_horario,
            id_veiculo: id_veiculo,
            status: status,
            observacao: observacao,
            dt_previsao: dt_previsao,
            dt_fim: undefined,
            produtos: []
        };

        AgendaService.create(agenda).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Cadastro realizado com sucesso!");
                        navigate('/agenda');
                    }
                } else {
                    alert("Não foi possível realizar o cadastro");
                }
            }
        }
        )
    }

    const handleEdit = async () => {
        console.log(agenda);
        let agd: IAgenda = {
            id: agenda.id,
            id_horario: agenda.id_horario,
            id_veiculo: agenda.id_veiculo,
            status: status,
            observacao: observacao,
            dt_previsao: dt_previsao,
            dt_fim: dt_fim,
            produtos: agenda.produtos
        };

        AgendaService.update(agd).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Alteração realizada com sucesso!");
                        navigate('/agenda');
                    }
                } else {
                    alert("Não foi possível realizar a alteração");
                }
            }
        }
        )
    }

    return (
        <Container id='container'>
            <h1>
                Cadastro
            </h1>
            <Form id="form">
                <Form.Group className="mb-3">
                    <Form.Label>Veículo</Form.Label>
                    <Form.Select name="dt_previsao" placeholder="Escolha um dos seus veículos" onChange={e => setId_Veiculo((e.target as any).value)} aria-label="Veículo">
                        <option selected>Escolha um dos seus veículos</option>
                        {veiculos.map(veiculo => (
                            <option key={veiculo.id} value={veiculo.id}>{veiculo.modelo} - {veiculo.placa}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" onChange={e => setStatus((e.target as any).value)} aria-label="Status">
                        <option selected>{Status.Pendente}</option>
                        <option disabled={true}>{Status.Reprovado}</option>
                        <option disabled={true}>{Status.Aprovado}</option>
                        <option disabled={true}>{Status.Em_Andamento}</option>
                        <option disabled={true}>{Status.Concluido}</option>
                        <option disabled={true}>{Status.Cancelado}</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Previsão de Termino</Form.Label>
                    <Form.Control name="dt_previsao" type="date" value={dt_previsao as any} onChange={e => setDt_Previsao((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data</Form.Label>
                    <Form.Control id="inputData" name="inputData" type="date" onChange={_ => loadHorariosDisponiveisPorDia()} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Horário</Form.Label>
                    <Form.Select name="horário" placeholder="Selecione um horário" aria-label="IHorario">
                        <option selected>Selecione um horário</option>

                        {horariosDisponiveis.map(horario => (
                            <option
                                key={horario.data.getTime()} // Usamos getTime() para obter uma chave única
                                disabled={horario.status === 'Ocupado'}
                                value={horario.data.getDate()}
                            >
                                {horario.data.getHours()}h{String(horario.data.getMinutes()).padStart(2, '0')}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Serviços</Form.Label>
                    <Form.Select id="servico" name="servico" placeholder="Selecione um serviço" aria-label="Serviços">
                        <option selected>Selecione um serviço</option>
                        {servicos.map(servico => (
                            <option key={servico.id} value={servico.id}>{servico.nome}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <button id="addButton" type="button" color="primary" onClick={_ => { addServico() }}>+</button>

                <div id="servicosAdd">
                    <h3>Serviços adicionados</h3>
                    <Row>
                        <div className="areaServicoAdd">
                            {
                                addedServicos.map(servico => (
                                    <button type="button" onClick={_ => removeServico(servico)}>
                                        {servico.nome}{<i className="bi bi-x-circle"></i>}
                                    </button>
                                ))
                            }
                        </div>
                    </Row>
                </div >

                <Form.Group className="mb-3">
                    <Form.Label>Observacao</Form.Label>
                    <Form.Control name="observacao" type="text" placeholder="Digite seu Observacao" value={observacao} onChange={e => setObservacao((e.target as any).value)} />
                </Form.Group>
            </Form >
            <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={(id !== undefined ? handleEdit : handleSubmit)} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/agendamentos')} type="button" size="lg" variant="primary">Voltar</Button>
                    </Row>
                </Col>
            </div>
        </Container >
    );

}
