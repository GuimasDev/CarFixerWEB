import React, { useEffect, useState } from "react";
import "./Agendamento.css";
import Button from "react-bootstrap/Button";
import { AgendaService, IAgenda } from "../../services/api/agenda/AgendaService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import edit from "../../assets/icons/edit.svg";	
import trash from "../../assets/icons/trash.svg";
import { IVeiculo, VeiculoService } from "../../services/api/veiculo/VeiculoService";
import { HorarioService, IHorario } from "../../services/api/horario/HorarioService";
import { ListTable } from "../../components/ListTable";

export const Agendamento = () => {
	const [agendas, setAgendas] = useState<IAgenda[]>([]);
	const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	const [modeloData, setModeloData] = useState<string[]>([]);
	const [horarioData, setHorarioData] = useState<string[]>([]);

	useEffect(() => {
		if (UsuarioService.getLogin().permission === "Admin") {

			AgendaService.get().then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setAgendas(result);
				}
			});

		} else {

			VeiculoService.getByUsuario(UsuarioService.getLogin().id as number).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setVeiculos([...veiculos, ...result]);
				}
			});

			veiculos.forEach((veiculo) => {
				AgendaService.getByVeiculo(veiculo.id).then((result) => {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						setAgendas([...agendas, ...result]);
					}
				});
			});
		}

		setUpdateList(false);
	}, [updateList]);

	// useEffect para buscar os horários e modelos antes de renderizar a tabela
	useEffect(() => {
		const fetchData = async () => {
			const horarioPromises = agendas.map(agenda => HorarioService.getById(agenda.id_horario));
			const modeloPromises = agendas.map(agenda => VeiculoService.getById(agenda.id_veiculo));

			const horarioResults = await Promise.all(horarioPromises);
			const modeloResults = await Promise.all(modeloPromises);

			// Arrays com os horários e modelos correspondentes
			setHorarioData(horarioResults.map(result => {
				if (result instanceof ApiException) {
					return "Erro ao buscar horário";
				} else {
					let hour = new Date(result.data);
					let data = `${hour.getDate()}/${hour.getMonth()}/${hour.getFullYear()}`;
					data += ` ${hour.getHours()}h${String(hour.getMinutes()).padStart(2, '0')}`;
					return data;
				}
			}));

			setModeloData(modeloResults.map(result => {
				if (result instanceof ApiException) {
					return "Erro ao buscar modelo";
				} else {
					return result.modelo + " - " + result.placa;
				}
			}));
		};

		fetchData();
	}, [agendas]);

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse veículo?")) {
			AgendaService.deleteById(id).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setUpdateList(true);
				}
			});
		}
	};

	const handleEdit = (id: number): any => {
		navigate(`/agendar/${id}`);
	};

	const thead = (
		<>
			<tr>
				<th>#</th>
				<th>Horário</th>
				<th>Veículo</th>
				<th>Status</th>
				<th>Observação</th>
				{/* <th>Produtos</th> */}
				<th>Previsão</th>
				<th>Fim</th>
				<th></th>
			</tr>
		</>);

	const tbody = (
		<>
			{agendas.map((agenda, index) => {
				return (
					<tr key={index}>
						<td>{index + 1}</td>
						<td>{horarioData[index]}</td>
						<td>{modeloData[index]}</td>
						<td>{agenda.status}</td>
						<td>{agenda.observacao}</td>
						{/* <td>{ }</td> */}
						<td>{dateString_YYYYmmdd_to_ddmmYY(String(agenda.dt_previsao))}</td>
						<td>{dateString_YYYYmmdd_to_ddmmYY(String(agenda.dt_fim))}</td>
						<td>
							<button onClick={(_) => handleEdit(agenda.id)}>
								<img src={edit} alt="" />
							</button>
							<button onClick={(_) => handleDelete(agenda.id)}>
								<img src={trash} alt="" />
							</button>
						</td>
					</tr>
				);
			})}
		</>
	)

	return (
	
		<div id="tabela">
			<h2>Agendamentos</h2>
			<ListTable thead={thead} tbody={tbody} />
			<div id="buttons">
				<Col>
					<Row>
						<Button onClick={(_) => navigate("/agendar")} type="button" size="lg" variant="warning">
							Agendar
						</Button>
					</Row>
				</Col>
			</div>
		</div>
	);
};


const dateString_YYYYmmdd_to_ddmmYY = (str: string) => {
	let foo = str.split("-");
	if (foo[2] != undefined) {
		return `${foo[2]}/${foo[1]}/${foo[0].slice(-2)}`;
	} else {
		return ""
	}
};