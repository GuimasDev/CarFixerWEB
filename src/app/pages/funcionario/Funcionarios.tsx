import React, { useEffect, useState } from "react";
import styles from "./Funcionarios.module.css";
import Button from "react-bootstrap/Button";
import { UsuarioService, IUsuario } from "../../services/api/usuario/UsuarioService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import { ListTable } from "../../components/ListTable";

export const Funcionarios = () => {
	const [funcionarios, setFuncionarios] = useState<IUsuario[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		UsuarioService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let userFuncionarios: IUsuario[] = [];
				result.map((usuario, i) => {
					if (usuario.permission === "Funcionario") {
						userFuncionarios.push(usuario);
					}
				});

				setFuncionarios(userFuncionarios);
				console.log(funcionarios)
			}
		});

		setUpdateList(false);
	}, [updateList]);

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse funcionário?")) {
			UsuarioService.deleteById(id).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setUpdateList(true);
				}
			});
		}
	};

	const handleEdit = (id: number): any => {
		navigate(`/funcionario/${id}`);
	};

	const getNome = (id: number): any => {
		UsuarioService.getById(id).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				return result.nome;
			}
		});
	};

	const thead = (
		<tr>
			<th>#</th>
			<th>Nome</th>
			<th>CPF</th>
			<th>Email</th>
			<th>Telefone</th>
			{/* <th>Veículos</th> */}
			<th></th>
		</tr>
	);
	const tbody = funcionarios.map((funcionario, index) => {
		return (
			<tr key={index}>
				<td>{index + 1}</td>
				<td>{funcionario.nome}</td>
				<td>{funcionario.cpf}</td>
				<td>{funcionario.email}</td>
				<td>{funcionario.telefone}</td>
				{/* <td>{}</td> */}
				<td>
					{/* <button onClick={(_) => handleEdit(funcionario.id)}>
						<img src={edit} alt="" />
					</button> */}
					<button onClick={(_) => handleDelete(funcionario.id)}>
						<img src={trash} alt="" />
					</button>
				</td>
			</tr>
		);
	});

	return (
		<>
			<div id={styles.tabela}>
				<h2 className={styles.title}>Funcionários</h2>
				<ListTable thead={thead} tbody={tbody} />
				{/* <div id="buttons">
					<Col>
						<Row>
							<Button onClick={(_) => navigate("/funcionario")} type="button" size="lg" variant="warning">
								Cadastrar funcionario
							</Button>
						</Row>
					</Col>
				</div> */}
				<div className={styles.buttonArea}>
					<button className={styles.button} onClick={(_) => navigate("/funcionario")} type="button">
						Novo funcionário
					</button>
				</div>
			</div>
		</>
	);
};
