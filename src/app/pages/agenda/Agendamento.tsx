import React, { useEffect, useState } from "react";
import "./Agendamento.css";
import Button from "react-bootstrap/Button";
import { AgendaService, IAgenda } from "../../services/api/agenda/AgendaService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import { IVeiculo, VeiculoService } from "../../services/api/veiculo/VeiculoService";
import { HorarioService } from "../../services/api/horario/HorarioService";

export const Agendamento = () => {
	const [agendas, setAgendas] = useState<IAgenda[]>([]);
	const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (UsuarioService.getLogin().permission == "Admin") {
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
					setVeiculos(result);
				}
			});

			veiculos.forEach((veiculo) => {
				AgendaService.getByVeiculo(veiculo.id).then((result) => {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						setAgendas(result);
					}
				});
			});
		}

		setUpdateList(false);
	}, [updateList]);

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
		navigate(`/add-agenda/${id}`);
	};

	const getModelo = (id: number): any => {
		VeiculoService.getById(id).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				return result.modelo;
			}
		});
	};

	const getHorario = (id: number): any => {
		HorarioService.getById(id).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				return result.data;
			}
		});
	};

	return (
		<div id="tabela">
			<Table striped bordered hover variant="dark">
				<thead>
					<tr>
						<th>#</th>
						<th>Horário</th>
						<th>Veículo</th>
						<th>Status</th>
						<th>Observação</th>
						<th>Produtos</th>
						<th>Previsão</th>
						<th>Fim</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						agendas.map((agenda, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{getHorario(Number(agenda.id_horario))}</td>
									<td>{getModelo(Number(agenda.id_veiculo))}</td>
									<td>{agenda.status}</td>
									<td>{agenda.observacao}</td>
									<td>{ }</td>
									<td>{dateString_YYYYmmdd_to_ddmmYY(String(agenda.dt_previsao)) || ""}</td>
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
				</tbody>
			</Table>
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