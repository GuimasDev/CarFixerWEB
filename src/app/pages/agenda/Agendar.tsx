import React, { useEffect, useMemo, useState } from "react";
import styles from "./Agendar.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { AgendaService, IAgenda, Status } from "../../services/api/agenda/AgendaService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import { IVeiculo, VeiculoService } from "../../services/api/veiculo/VeiculoService";
import { HorarioService, IHorario } from "../../services/api/horario/HorarioService";
import { IServico, ServicoService } from "../../services/api/servico/ServicoService";
import { IProduto, ProdutoService } from "../../services/api/produto/ProdutoService";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { useUserType } from "../../components/UserTypeContext";
import Loading from "../../components/Loading";

export const Agendar = () => {
	const { userType } = useUserType();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	// const [agendas, setAgendas] = useState<IAgenda[]>([]);
	const [agenda, setAgenda] = useState<IAgenda>({
		id: 0,
		id_horario: 0,
		id_veiculo: 0,
		status: Status.Pendente,
		observacao: "",
		dt_previsao: undefined,
		dt_fim: undefined,
		produtos: [],
	});

	const [horario, setHorario] = useState("");
	const [id_horario, setId_Horario] = useState(0);
	const [id_veiculo, setId_Veiculo] = useState(0);
	const [status, setStatus] = useState(Status.Pendente);
	const [observacao, setObservacao] = useState("");
	const [dt_previsao, setDt_Previsao] = useState<Date>();
	const [dt_fim, setDt_Fim] = useState<Date>();
	const [data, setData] = useState<IHorario>();

	const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
	const [servicos, setServicos] = useState<IServico[]>([]);
	const [produtos, setProdutos] = useState<IProduto[]>([]);
	const [addedServicos, setAddedServicos] = useState<IServico[]>([]);
	const [addedProdutos, setAddedProdutos] = useState<IProduto[]>([]);

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
		if (id !== undefined) {
			setIsEditing(true);
			AgendaService.getById(parseInt(id as string)).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					const editedAgenda = result;
					setAgenda(editedAgenda);
					setStatus(editedAgenda.status);
					setObservacao(editedAgenda.observacao);
					setDt_Previsao(editedAgenda.dt_previsao);
					setDt_Fim(editedAgenda.dt_fim);
					setId_Horario(editedAgenda.id_horario);
					setId_Veiculo(editedAgenda.id_veiculo);
					setAddedProdutos(editedAgenda.produtos);
					
					ServicoService.getByIdAgenda(editedAgenda.id).then((result) => {
						if (result instanceof ApiException) {
							alert(result.message);
						} else {
							setAddedServicos(result);
						}
					});
				}
			});
		}
	}, [])

	useEffect(() => {
		if (userType === "Admin") {
			VeiculoService.get().then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setVeiculos(result);
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
		}
	}, [])

	useEffect(() => {
		ProdutoService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let produtos = result
				addedProdutos.forEach(produto =>{
					produtos = produtos.filter(({ id }) => id != produto.id)
				})

				setProdutos(produtos);
			}
		});
	}, [])

	useEffect(() => {
		ServicoService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let servicos = result
				addedServicos.forEach(servico =>{
					servicos = servicos.filter(({ id }) => id != servico.id)
				})

				setServicos(servicos);
			}
		});
	}, [addedServicos])

	useEffect(() => {
		HorarioService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				setHorariosOcupados(result);
			}
		});
	}, [])

	useEffect(() => {
		HorarioService.getById(agenda.id_horario).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				setData(result);
				// loadHorariosDisponiveisPorDia();
			}
		})
	}, [agenda])

	function calcularHorarios(dia: Date) {
		let horarios: IHorario[] = [];
		let horasTotal = horario_rangeMax.getHours() - horario_rangeMin.getHours();

		for (let horasTrabalhando = 0; horasTrabalhando < horasTotal; horasTrabalhando += horasPorAgendamento) {
			let horas = horario_rangeMin.getHours() + horasTrabalhando;
			dia.setHours(horas);

			let horario = new IHorario(new Date(dia));
			horarios.push(horario);
		}

		return horarios;
	}

	function loadHorariosDisponiveisPorDia() {
		let dataHTML: any = document.getElementById("inputData");
		// console.log(dataHTML);
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
					horariosDoDia[i].data.getTime() + horariosDoDia[i].data.getTimezoneOffset() * 60000
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
								// console.log("horarios iguais: ");
								// console.log(objVal1);
								// console.log(objVal2);
							}
						}
					}
				}
			}
		}

		// console.log(horariosDoDia);
		setHorariosDisponiveis(horariosDoDia);
	}

	function addServico() {
		let select: any = document.getElementById("servico");
		let idService = select.value;

		if (select.value > 0) {
			ServicoService.getById(parseFloat(idService)).then((result: any) => {
				addedServicos.push(result);
				setServicos(servicos.filter(({ id }) => id != idService));
			});
		}

		select.value = "";
	}

	function removeServico(servico: IServico) {
		setAddedServicos(addedServicos.filter(({ id }) => id != servico.id));
		servicos.push(servico);
	}

	function addProduto() {
		let select: any = document.getElementById("produto");
		let idProduto = select.value;

		if (select.value > 0) {
			ProdutoService.getById(parseFloat(idProduto)).then((result: any) => {
				addedProdutos.push(result);

				setProdutos(produtos.filter(({ id }) => id != idProduto));
			});
		}

		select.value = "";
	}

	function removeProduto(produto: IProduto) {
		setAddedProdutos(addedProdutos.filter(({ id }) => id != produto.id));
		produtos.push(produto);
	}

	const handleSubmit = async () => {
		try {

			// Crie uma nova entrada no Horario
			// console.log("Horario:	")
			// console.log(horario);
			const dataSelect = new Date(horario as any);
			// console.log(dataSelect);
			const horarioResult = await HorarioService.create(new IHorario(dataSelect));
			// console.log(horarioResult);
			const horarioSalvo = horarioResult as IHorario;
			// console.log(horarioSalvo);

			// Atualize a agenda com o ID do Horario salvo
			const updatedAgenda: Omit<IAgenda, "id"> = {
				// ...agenda,
				id_horario: horarioSalvo.id,
				// id_horario: id_horario,
				status: status,
				id_veiculo: id_veiculo,
				dt_previsao: dt_previsao,
				observacao: observacao,
				produtos: [],
				dt_fim: undefined,
			};
			// console.log(updatedAgenda);

			// Crie uma nova entrada na Agenda
			const agendaResult = await AgendaService.create(updatedAgenda);
			const savedAgenda = agendaResult as IAgenda;

			// Atualize o status do Horario para 'Ocupado'
			horarioSalvo.status = "Ocupado";
			await HorarioService.update(horarioSalvo); // Supondo que você tenha um método de atualização em HorarioService

			// Adicione os serviços selecionados à agenda
			for (const servico of addedServicos) {
				await ServicoService.putOnAgenda(savedAgenda.id, servico.id);
			}
			for (const produto of addedProdutos) {
				await ProdutoService.putOnAgenda(savedAgenda.id, produto.id);
			}

			// Exiba uma mensagem de sucesso e navegue para '/agendamentos'
			alert("Registro salvo com sucesso!!!");
			navigate("/agendamentos");

		} catch (error) {
			console.error("Erro:", error);
			alert("Erro ao salvar o registro. Verifique os dados e tente novamente.");
		}
	};

	const handleEdit = async () => {
		// console.log(agenda);
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

		
		let adicionarServicosNaAgenda = () => {
			addedServicos.forEach(servico =>{
				ServicoService.putOnAgenda(agd.id, servico.id);
			})
		}

		
		
		ServicoService.getByIdAgenda(agd.id).then((result)=>{
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let servicos = result;
				if (servicos.length > 0) {
					ServicoService.deleteAllFromAgenda(agd.id).then((result)=>{
						if (result instanceof ApiException) {
							alert(result.message);
						} else {
							adicionarServicosNaAgenda();
						}
					})
				} else adicionarServicosNaAgenda();
			}
		})




		let adicionarProdutosNaAgenda = () => {
			addedProdutos.forEach(produto =>{
				ProdutoService.putOnAgenda(agd.id, produto.id);
			})
		}

		ProdutoService.getByIdAgenda(agd.id).then((result)=>{
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let produtos = result;
				if (produtos.length > 0) {
					ProdutoService.deleteAllFromAgenda(agd.id).then((result)=>{
						if (result instanceof ApiException) {
							alert(result.message);
						} else {
							adicionarProdutosNaAgenda();
						}
					})
				} else adicionarProdutosNaAgenda();

			}})



		AgendaService.update(agd).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result != null) {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						alert("Alteração realizada com sucesso!");
						navigate("/agendamentos");
					}
				} else {
					alert("Não foi possível realizar a alteração");
				}
			}
		});


	};

	// Função para criar a lista de opções com value = id e label = modelo - placa.
	function getOptionsFromVeiculos(veiculos: IVeiculo[]) {
		return veiculos.map((veiculo) => ({
			value: veiculo.id,
			label: `${veiculo.modelo} - ${veiculo.placa}`,
		}));
	}
	function getOptionsFromHorarios(horarios: IHorario[]) {
		// console.log(horarios);
		return horarios.map((horario: IHorario) => (
			horario !== undefined ?
				{
					id: horario.id,
					value: horario.data,
					status: horario.status,
					label: `${horario.data.getHours()}h${String(horario.data.getMinutes()).padStart(2, "0")}`,
				} : {}
		));
	}
	// Use useMemo para memorizar a lista de opções.
	const memorizedHorarios = useMemo(() => getOptionsFromHorarios(horariosDisponiveis), [horariosDisponiveis]);
	const memorizedVeiculos = useMemo(() => getOptionsFromVeiculos(veiculos), [veiculos]);

	const veiculoProps = {
		id: "veiculo",
		name: "veiculo",
		label: "Veículo",
		defaultValue: isEditing
			? veiculos.map((veiculo) => (veiculo.id === id_veiculo ? `${veiculo.modelo} - ${veiculo.placa}` : ""))
			: userType == "Cliente"
				? "Escolha um dos seus veículos"
				: "Escolha um veículo",
		onChange: (e: any) => setId_Veiculo(e.target.value),
		disabled: isEditing && userType !== 'Admin' ? true : isEditing ? dt_fim !== null : dt_fim !== undefined,
	};

	const statusProps = {
		id: "status",
		name: "status",
		label: "Status",
		defaultValue: (userType === 'Admin' ? status : isEditing ? status : Status.Pendente),
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStatus((e.target as any).value),
		disabled: isEditing ? dt_fim !== null : dt_fim !== undefined,
	}

	const inputDataProps = {
		id: "inputData",
		name: "inputData",
		label: "Data",
		type: "date",
		defaultValue: isEditing ? undefined : "",
		value: isEditing && data !== undefined ? dateToString(new Date(data.data)) : undefined,
		// value: (horariosOcupados.map((horario) => {
		// 	if (horario.id === agenda.id_horario) {
		// 		return dateToString(new Date(horario.data));
		// 	}
		// })),
		onChange: loadHorariosDisponiveisPorDia,
		disabled: isEditing ? true : isEditing ? dt_fim !== null : dt_fim !== undefined,
	};

	const horarioProps = {
		id: "horario",
		name: "horario",
		label: "Horário",
		defaultValue: isEditing
			? data !== undefined ? dateToStringHour(new Date(data.data)) : ''
			: "Escolha um horário",
		onChange: ((e: React.ChangeEvent<HTMLInputElement>) => { return setHorario(e.target.value as any); }),
		// && (isEditing ? loadHorariosDisponiveisPorDia : null)
		disabled: isEditing && userType !== 'Admin' ? true : isEditing ? dt_fim !== null : dt_fim !== undefined,
	}

	const dt_previsaoProps = {
		id: "dt_previsao",
		name: "dt_previsao",
		label: "Previsão de término",
		type: "date",
		defaultValue: isEditing && dt_previsao !== undefined ? dt_previsao : "Ainda não há uma previsão de término!",
		value: dt_previsao,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDt_Previsao((e.target as any).value)
	}

	const dt_fimProps = {
		id: "dt_fim",
		name: "dt_fim",
		label: "Data do fim do agendamento",
		type: "date",
		defaultValue: agenda.id !== undefined ? undefined : "",
		value: dt_fim,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDt_Fim((e.target as any).value),
		disabled: dt_fim !== null,
	}

	const servicoProps = {
		id: "servico",
		name: "servico",
		label: "Serviços",
		defaultValue: "Selecione um serviço",
		disabled: isEditing ? dt_fim !== null : dt_fim !== undefined
	}

	const produtosProps = {
		id: "produto",
		name: "produto",
		label: "Produtos",
		defaultValue: "Selecione um produto",
		disabled: isEditing ? dt_fim !== null : dt_fim !== undefined
	}

	const observacaoProps = {
		id: "observacao",
		name: "observacao",
		label: "Observação",
		type: "text",
		placeholder: isEditing ? "Ainda sem observações!" : "Insira alguma observação",
		value: observacao,
		// defaultValue: isEditing && observacao !== null ? observacao : "",
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => setObservacao((e.target as any).value),
		disabled: isEditing ? dt_fim !== null : dt_fim !== undefined
	}

	const statusOptions = [
		{ value: Status.Pendente, label: "Pendente" },
		{ value: Status.Reprovado, label: "Reprovado" },
		{ value: Status.Aprovado, label: "Aprovado" },
		{ value: Status.Em_Andamento, label: "Em Andamento" },
		{ value: Status.Concluido, label: "Concluído" },
		{ value: Status.Cancelado, label: "Cancelado" },
	];

	return (

		<Container className={styles.container}>
			<>
				<h1>{id !== undefined ? "Editar Agenda" : "Nova Agenda"}</h1>
				<Form id="form">

					<div className={styles.rowGroup}>
						<Select
							className={styles.input + " veiculo"}	{...veiculoProps}
						>
							{memorizedVeiculos.map((option) =>
							(option.value !== id_veiculo ?
								<option disabled={isEditing ? true : false} key={option.value} value={option.value}>
									{option.label}
								</option>
								: '')
							)}
						</Select>

						{isEditing ?
							<Select
								className={styles.input + " status"} {...statusProps}
							>
								{statusOptions.map((option) => (
									userType !== "Cliente" ?
										<option key={option.value} hidden={status === option.value} disabled={isEditing ? dt_fim !== null : dt_fim !== undefined}>
											{option.label}
										</option>
										: null
								))}
							</Select>
							: userType !== "Cliente" ?
								<Select
									className={styles.input + " status"} {...statusProps}
								>
									{statusOptions.map((option) => (
										userType !== "Cliente" ?
											<option key={option.value} hidden={status === option.value} disabled={isEditing ? dt_fim !== null : dt_fim !== undefined}>
												{option.label}
											</option>
											: null
									))}
								</Select>
								: null
						}
					</div>

					<div className={styles.rowGroup}>
						<Input
							className={styles.input + " inputData"} {...inputDataProps}
						/>

						<Select
							className={styles.input + " horario"}  {...horarioProps} >
							{/* {memorizedHorarios.map((option) => (console.log(option.value)))} */}
							{memorizedHorarios.map((option) => (
								option.value !== undefined ? !isNaN(option.value.valueOf()) ?
									option.id === agenda.id_horario ?
										// <option key={option.id} value={String(option.value)} disabled={isEditing && userType !== 'Admin' ? true : dt_fim !== undefined}>
										<option key={option.id} value={String(option.value)} disabled={isEditing && userType !== 'Admin' || (option.status === "Ocupado"? true : false)}>
											{option.label}
										</option>
										: null
									: null : null
							))}
						</Select>
					</div>

					<div className={styles.rowGroup}>
						{userType !== 'Admin' && isEditing ?
							<Input
								className={styles.input + " dt_previsao"}
								{...dt_previsaoProps}
								disabled={true}
							/>
							: userType !== 'Cliente' ?
								<Input
									className={styles.input + " dt_previsao"}
									{...dt_previsaoProps}
									disabled={false}
									// disabled={isEditing? true : dt_fim !== null}
								/>
								: ''
						}

						{isEditing && userType !== 'Cliente' ?
							<Input
								className={styles.input + " dt_fim"}
								{...dt_fimProps}
							/>
							: isEditing && dt_fim !== null ?
								<Input
									className={styles.input + " dt_fim"}
									{...dt_fimProps}
								/>
								: ''}
					</div>

					<div className={styles.rowGroup}>
						<div className={styles.rowWithAddButton}>
							<Select
								className={styles.input + " servico"}
								{...servicoProps}
							>
								{servicos.map((servico) => (
									<option key={servico.id} value={servico.id} disabled={isEditing ? dt_fim !== null : dt_fim !== undefined}>
										{servico.nome}
									</option>
								))}
							</Select>

							<Button
								id="addButton"
								type="button"
								color="primary"
								onClick={(_) => {
									addServico();
								}}
							>
								+
							</Button>
						</div>
						<div style={{ width: "100%" }}>
							<h3>Serviços adicionados</h3>
							<div className={styles.itemAddedArea}>
								{addedServicos.map((servico) => (
									<button className={styles.itemAdded} onClick={(_) => removeServico(servico)}>
										{servico.nome}
										<i className="bi bi-x-circle"></i>
									</button>
								))}
							</div>
						</div>
					</div>

					<div className={styles.rowGroup}>
						<div className={styles.rowWithAddButton}>
							<Select
								className={styles.input + " produto"}
								style={{ flexGrow: 1 }}
								{...produtosProps}
							>
								{produtos.map((produto) => (
									<option key={produto.id} value={produto.id} disabled={isEditing ? dt_fim !== null : dt_fim !== undefined}>
										{produto.descricao}
									</option>
								))}
							</Select>
							<Button
								id="addButton"
								type="button"
								style={{ flexGrow: 0 }}
								color="primary"
								onClick={(_) => {
									addProduto();
								}}
							>
								+
							</Button>
						</div>
						<div style={{ width: "100%" }}>
							<h3>Produtos adicionados</h3>
							<Row>
								<div className={styles.itemAddedArea} >
									{addedProdutos.map((produto) => (
										<button type="button" className={styles.itemAdded} onClick={(_) => removeProduto(produto)}>
											{produto.descricao}
											<i className="bi bi-x-circle"></i>
										</button>
									))}
								</div>
							</Row>
						</div>
					</div>

					<Input
						className="observacao"
						{...observacaoProps}
					/>
				</Form>

				<div className={styles.buttonArea}>
					<button
						className={styles.cadastrarButton}
						form="form"
						onClick={id !== undefined ? handleEdit : handleSubmit}
						type="button"
					>
						{id !== undefined ? "Salvar" : "Cadastrar"}
					</button>
					<button className={styles.voltarButton} onClick={(_) => navigate("/agendamentos")} type="button">
						Voltar
					</button>
				</div>
			</>
		</Container>
	);
};

function convertDateFormat(date: Date): string | null {
	// Check if the date is valid
	if (!date || isNaN(date.getTime())) {
		console.error("Invalid date string");
		return null;
	}

	const formattedDate = date.toISOString().split('T')[0];
	return formattedDate;
}

const dateToString = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
	const day = date.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário

	return `${year}-${month}-${day}`;
};

const dateToStringHour = (date: Date) =>
	`${date.getHours()}h${String(date.getMinutes()).padStart(2, "0")}`
// console.log(`${date.getHours()}h${String(date.getMinutes()).padStart(2, "0")}`)

// `${date.getHours()}h${twoDigitsCheck(date.getMinutes())}`

// {{twoDigitsCheck(horario.data.getMinutes())}}
const twoDigitsCheck = (num: number) => {
	return num >= 10 ? num : `0${num}`;
}