import React, { useEffect, useState } from "react";
import styles from "./Clientes.module.css";
import Button from "react-bootstrap/Button";
import { UsuarioService, IUsuario } from "../../services/api/usuario/UsuarioService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import gear from "../../assets/icons/gear.svg";
import { ListTable } from "../../components/ListTable";

export const Clientes = () => {
	const [clientes, setClientes] = useState<IUsuario[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		UsuarioService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				let userClientes: IUsuario[] = [];
				result.map((usuario, i) => {
					if (usuario.permission === "Cliente") {
						userClientes.push(usuario);
					}
				});

				setClientes(userClientes);
			}
		});

		setUpdateList(false);
	}, [updateList]);

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse cliente?")) {
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
		navigate(`/cliente/${id}`);
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
			<th><img src={gear} alt="" /></th>
		</tr>
	);
	const tbody = clientes.map((cliente, index) => {
		return (
			<tr key={index}>
				<td>{index + 1}</td>
				<td>{cliente.nome}</td>
				<td>{cliente.cpf}</td>
				<td>{cliente.email}</td>
				<td>{cliente.telefone}</td>
				{/* <td>{}</td> */}
				<td className={styles.sideButtonArea}>
					<button className={styles.sideButton} onClick={(_) => handleEdit(cliente.id)}>
						<img color="blue" src={edit} alt="" />
					</button>
					<button className={styles.sideButton} onClick={(_) => handleDelete(cliente.id)}>
						<img src={trash} alt="" />
					</button>
				</td>
			</tr>
		);
	});

	return (
		<>
			<div id={styles.tabela}>
				<h2 className={styles.title}>Clientes</h2>
				<ListTable thead={thead} tbody={tbody} />
				{/* <div id="buttons">
					<Col>
						<Row>
							<Button onClick={(_) => navigate("/cliente")} type="button" size="lg" variant="warning">
								Cadastrar cliente
							</Button>
						</Row>
					</Col>
				</div> */}
				<div className={styles.buttonArea}>
					<button className={styles.button} onClick={(_) => navigate("/cliente")} type="button">
						Novo cliente
					</button>
				</div>
			</div>
		</>
	);
};
