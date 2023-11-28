import React, { useEffect, useState } from "react";
import styles from "./Agendamento.module.css";
import { AgendaService, IAgenda } from "../../services/api/agenda/AgendaService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { IUsuario, UsuarioService } from "../../services/api/usuario/UsuarioService";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import gear from "../../assets/icons/gear.svg";
import { VeiculoService } from "../../services/api/veiculo/VeiculoService";
import { HorarioService, IHorario } from "../../services/api/horario/HorarioService";
import { ListTable } from "../../components/ListTable";
import { useUserType } from "../../components/UserTypeContext";

// Ao mudar uma linha de código, lista as agendas mais de uma vez, duplicando-as
export const Agendamento = () => {
	const { userType } = useUserType();
	const user: IUsuario = UsuarioService.getLogin();
	const [agendas, setAgendas] = useState<IAgenda[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	const [modeloData, setModeloData] = useState<string[]>([]);
	const [horarioData, setHorarioData] = useState<string[]>([]);

	useEffect(() => {
		if (userType === "Admin") {
			AgendaService.get().then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setAgendas(result);
				}
			});
		} else {
			user.veiculos.forEach((veiculo: any) => {
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
			const horarioPromises = agendas.map((agenda) => HorarioService.getById(agenda.id_horario));
			const modeloPromises = agendas.map((agenda) => VeiculoService.getById(agenda.id_veiculo));

			const horarioResults = await Promise.all(horarioPromises);
			const modeloResults = await Promise.all(modeloPromises);


			// Reinicia os arrays antes de adicionar novos dados
			setHorarioData([]);
			setModeloData([]);

			// Arrays com os horários e modelos correspondentes
			setHorarioData(
				horarioResults.map((result) => {
					if (result instanceof ApiException) {
						return "Erro ao buscar horário";
					} else {
						let hour = new Date(result.data);
						let data = `${hour.getDate()}/${hour.getMonth()}/${hour.getFullYear()}`;
						data += ` ${hour.getHours()}h${String(hour.getMinutes()).padStart(2, "0")}`;
						return data;
					}
				})
			);

			setModeloData(
				modeloResults.map((result) => {
					if (result instanceof ApiException) {
						return "Erro ao buscar modelo";
					} else {
						return result.modelo + " - " + result.placa;
					}
				})
			);


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
				<th><img src={gear} alt="" /></th>
			</tr>
		</>
	);

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
						{/* <td>{ }</td> Produtos */}
						<td>{dateString_YYYYmmdd_to_ddmmYY(String(agenda.dt_previsao))}</td>
						<td>{(agenda.dt_fim !== null ? dateString_YYYYmmdd_to_ddmmYY(String(agenda.dt_fim)):'Ainda não definido!	')}</td>
						<td>
							<button className={styles.botaoEdit} onClick={(_) => handleEdit(agenda.id)}>
								<img src={edit} alt="" />
							</button>
							<i className="bi bi-pencil-square"></i>
							{/* <button onClick={(_) => handleDelete(agenda.id)}>
								<img src={trash} alt="" />
							</button> */}
						</td>
					</tr>
				);
			})}
		</>
	);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Agendamentos</h2>
			{(
				agendas.length > 0 ? <div className={styles.table}><ListTable thead={thead} tbody={tbody} /></div> : <p className={styles.info}>Nenhum agendamento registrado!</p>
			)}

			<div className={styles.buttonArea}>
				<button className={styles.button} onClick={(_) => navigate("/agendar")} type="button">
					Nova Agenda
				</button>
			</div>
		</div>
	);
};

const dateString_YYYYmmdd_to_ddmmYY = (str: string) => {
	let foo = str.split("-");
	if (foo[2] != undefined) {
		return `${foo[2]}/${foo[1]}/${foo[0].slice(-2)}`;
	} else {
		return "";
	}
};
