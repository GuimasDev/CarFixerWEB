import React, { useEffect, useMemo, useState } from 'react';
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
import { IProduto, ProdutoService } from '../services/api/produto/ProdutoService';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

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

    const [horario, setHorario] = useState();
    const [id_horario, setId_Horario] = useState(0);
    const [id_veiculo, setId_Veiculo] = useState(0);
    const [status, setStatus] = useState(Status.Pendente);
    const [observacao, setObservacao] = useState('');
    const [dt_previsao, setDt_Previsao] = useState<Date>();
    const [dt_fim, setDt_Fim] = useState<Date>();

    const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
    const [servicos, setServicos] = useState<IServico[]>([]);
    const [addedServicos, setAddedServicos] = useState<IServico[]>([]);
    const [produtos, setProdutos] = useState<IProduto[]>([]);
    const [addedProdutos, setAddedProdutos] = useState<IProduto[]>([]);

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
        ProdutoService.get().then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setProdutos(result);
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

    function addProduto() {
        let select: any = document.getElementById('produto');
        let idProduto = select.value;

        if (select.value > 0) {
            ProdutoService.getById(parseFloat(idProduto)).then((result: any) => {
                addedProdutos.push(result);
                setProdutos(produtos.filter(({ id }) => id != idProduto));
            });
        }

        select.value = '';
    }

    function removeProduto(produto: IProduto) {
        setAddedProdutos(addedProdutos.filter(
            ({ id }) => id != produto.id
        ));
        produtos.push(produto);
    }

    // const handleSubmit = async () => {
    //     let agd: Omit<IAgenda, 'id'> = {
    //         id_horario: id_horario,
    //         id_veiculo: id_veiculo,
    //         status: status,
    //         observacao: observacao,
    //         dt_previsao: dt_previsao,
    //         dt_fim: undefined,
    //         produtos: addedProdutos
    //     };

    //     let dataSelect = new Date(horario as any);

    //     HorarioService.create(new IHorario(dataSelect)).then((result) => {
    //         let horarioSalvo = result as IHorario;
    //         console.log('horario pre-salvo no banco: ');
    //         console.log(horarioSalvo);
    //         console.log(id_veiculo);

    //         agenda.id_horario = horarioSalvo.id;

    //         agenda.status = status;

    //         agenda.id_veiculo = id_veiculo;
    //         agenda.dt_previsao = dt_previsao;
    //         agenda.observacao = observacao;
    //         agenda.produtos = [];

    //         console.log(
    //             'id_horario = ' +
    //             agenda.id_horario +
    //             'status = ' +
    //             agenda.status +
    //             'id_veiculo = ' +
    //             agenda.id_veiculo +
    //             'dt_previsao = ' +
    //             agenda.dt_previsao +
    //             'observacao = ' +
    //             agenda.observacao +
    //             'produtos = ' +
    //             agenda.produtos
    //         );

    //         AgendaService.create(agenda).then((result) => {
    //             let agenda = result as IAgenda;

    //             horarioSalvo.status = 'Ocupado';
    //             HorarioService.create(horarioSalvo);

    //             addedServicos.forEach((servico) => {
    //                 ServicoService.putOnAgenda(agenda.id, servico.id);
    //             });
    //             // se servicos não forem salvos, exibir msg de erro
    //             alert('Registro salvo com sucesso!!!');
    //             navigate('/agendamentos');
    //         });
    //     });

    //     {/* console.log(agd);
    //     AgendaService.create(agd).then((result) => {
    //         if (result instanceof ApiException) {
    //                     alert(result.message);
    //         } else {
    //             if (result != null) {
    //                 if (result instanceof ApiException) {
    //                     alert(result.message);
    //                 } else {
    //                     ServicoService.getByIdAgenda(agenda.id).then((result: any) => {
    //                         let servicos = result as IServico[];
    //                         if (servicos.length > 0) {
    //                             console.log('servicos: Precisa deletar');

    //                             ServicoService.deleteAllFromAgenda(agenda.id).then((_) => {
    //                                 console.log('servicos: deletados!!');
    //                                 if (addedServicos.length > 0) {
    //                                     addedServicos.forEach((servico) => {
    //                                         ServicoService.putOnAgenda(agenda.id, servico.id).then(_ => window.location.reload());
    //                                     });
    //                                     console.log('servicos: adicionados!!');
    //                                     console.log(addedServicos);
    //                                 }
    //                             });
    //                         } else {
    //                             addedServicos.forEach((servico) => {
    //                                 ServicoService.putOnAgenda(agenda.id, servico.id).then(_ => window.location.reload());
    //                             });
    //                             console.log('servicos adicionados');
    //                             console.log(addedServicos);
    //                         }
    //                     })

    //                     ProdutoService.getByIdAgenda(agenda.id).then((result: any) => {
    //                     let produtos = result as IProduto[];
    //                         if (produtos.length > 0) {
    //                     console.log('produtos: Precisa deletar');

    //                             ProdutoService.deleteAllFromAgenda(agenda.id).then((_) => {
    //                     console.log('produtos: deletados!!');
    //                                 if (addedProdutos.length > 0) {
    //                     addedProdutos.forEach((produto) => {
    //                         ProdutoService.putOnAgenda(agenda.id, produto.id).then(_ => window.location.reload());
    //                     });
    //                 console.log('produtos: adicionados!!');
    //                 console.log(addedProdutos);
    //                                 }
    //                             });
    //                         } else {
    //                     addedProdutos.forEach((produto) => {
    //                         ProdutoService.putOnAgenda(agenda.id, produto.id).then(_ => window.location.reload());
    //                     });
    //                 console.log('produtos adicionados');
    //                 console.log(addedProdutos);
    //                         }
    //                     })

    //                 alert("Cadastro realizado com sucesso!");
    //                 navigate('/agenda');
    //                 }
    //             } else {
    //                     alert("Não foi possível realizar o cadastro");
    //             }

    //         }
    //     }) */}
    // }

    const handleSubmit = async () => {
        try {
            if (agenda.id !== undefined) {
                // Crie uma nova entrada no Horario
                const dataSelect = new Date(horario as any);
                const horarioResult = await HorarioService.create(new IHorario(dataSelect));
                const horarioSalvo = horarioResult as IHorario;

                // Atualize a agenda com o ID do Horario salvo
                const updatedAgenda: Omit<IAgenda, 'id'> = {
                    ...agenda,
                    id_horario: horarioSalvo.id,
                    status: status,
                    id_veiculo: id_veiculo,
                    dt_previsao: dt_previsao,
                    observacao: observacao,
                    produtos: [],
                    dt_fim: undefined
                };

                // Crie uma nova entrada na Agenda
                const agendaResult = await AgendaService.create(updatedAgenda);
                const savedAgenda = agendaResult as IAgenda;

                // Atualize o status do Horario para 'Ocupado'
                horarioSalvo.status = 'Ocupado';
                await HorarioService.update(horarioSalvo); // Supondo que você tenha um método de atualização em HorarioService

                // Adicione os serviços selecionados à agenda
                for (const servico of addedServicos) {
                    await ServicoService.putOnAgenda(savedAgenda.id, servico.id);
                }

                // Exiba uma mensagem de sucesso e navegue para '/agendamentos'
                alert('Registro salvo com sucesso!!!');
                navigate('/agendamentos');
            } else {
                alert('O ID da agenda não está definido. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar o registro. Verifique os dados e tente novamente.');
        }
    };



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
            produtos: addedProdutos
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

    // Função para criar a lista de opções com value = id e label = modelo - placa.
    function getOptionsFromVeiculos(veiculos: IVeiculo[]) {
        return veiculos.map((veiculo) => ({
            value: veiculo.id,
            label: `${veiculo.modelo} - ${veiculo.placa}`,
        }));
    }
    function getOptionsFromHorarios(horarios: IHorario[]) {
        return horarios.map((horario: IHorario) => ({
            id: horario.id,
            value: String(horario.data.getDate()),
            label: `${horario.data.getHours()}h${String(horario.data.getMinutes()).padStart(2, '0')}`,
        }));
    }

    // Use useMemo para memorizar a lista de opções.
    const memorizedHorarios = useMemo(() => getOptionsFromHorarios(horariosDisponiveis), [horariosDisponiveis]);
    const memorizedVeiculos = useMemo(() => getOptionsFromVeiculos(veiculos), [veiculos]);
    //     <option
    //         key={horario.data.getTime()}
    //         disabled={horario.status === 'Ocupado'}
    //         value={horario.data.getDate()}
    //     >
    //         {horario.data.getHours()}h{String(horario.data.getMinutes()).padStart(2, '0')}
    //     </option>
    // )), [horariosDisponiveis]);

    return (
        <Container id='container'>
            <h1>
                Cadastro
            </h1>
            <Form id="form">
                <Select className='veiculo' id='veiculo' name='veiculo' label='Veículo' defaultValue='Escolha um dos seus veículos' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId_Veiculo((e.target as any).value)} >
                    {memorizedVeiculos.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>

                <Select className='status' id='status' name='status' label='Status' defaultValue={Status.Pendente} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus((e.target as any).value)} >
                    {/* <option>{Status.Pendente}</option> */}
                    <option disabled>{Status.Reprovado}</option>
                    <option disabled>{Status.Aprovado}</option>
                    <option disabled>{Status.Em_Andamento}</option>
                    <option disabled>{Status.Concluido}</option>
                    <option disabled>{Status.Cancelado}</option>
                </Select>

                <Input className='dt_previsao' id='dt_previsao' name='dt_previsao' label='Previsão de termino' type='date' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDt_Previsao((e.target as any).value)} />

                <Input className='inputData' id='inputData' name='inputData' label='Data' type='date' onChange={loadHorariosDisponiveisPorDia} />

                <Select className="horario" id="horario" name="horario" label="Horário" defaultValue="Escolha um horário" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorario(e.target.value as any)}>
                    {memorizedHorarios.map((option) => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>

                <Select className="servico" id="servico" name="servico" label="Serviços" defaultValue="Selecione um serviço">
                    {servicos.map(servico => (
                        <option key={servico.id} value={servico.id}>{servico.nome}</option>
                    ))}
                </Select>
                <Button id="addButton" type="button" color="primary" onClick={_ => { addServico() }}>+</Button>
                <div id="servicosAdd">
                    <h3>Serviços adicionados</h3>
                    <Row>
                        <div className="areaServicoAdd">
                            {
                                addedServicos.map(servico => (
                                    <Button type="button" onClick={_ => removeServico(servico)}>
                                        {servico.nome}<i className="bi bi-x-circle"></i>
                                    </Button>
                                ))
                            }
                        </div>
                    </Row>
                </div >

                <Select className="produto" id="produto" name="produto" label="Produtos" defaultValue="Selecione um produto">
                    {produtos.map(produto => (
                        <option key={produto.id} value={produto.id}>{produto.descricao}</option>
                    ))}
                </Select>
                <Button id="addButton" type="button" color="primary" onClick={_ => { addProduto() }}>+</Button>
                <div id="produtosAdd">
                    <h3>Produtos adicionados</h3>
                    <Row>
                        <div className="areaProdutoAdd">
                            {
                                addedProdutos.map(produto => (
                                    <Button type="button" onClick={_ => removeProduto(produto)}>
                                        {produto.descricao}<i className="bi bi-x-circle"></i>
                                    </Button>
                                ))
                            }
                        </div>
                    </Row>
                </div >

                <Input className='observacao' id='observacao' name='observacao' label='Observação' type='text' placeholder='Insira alguma observação' value={observacao} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObservacao((e.target as any).value)} />
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