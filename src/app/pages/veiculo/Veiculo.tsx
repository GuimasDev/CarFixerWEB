import React, { useEffect, useState } from "react";
import "./Veiculo.css";
import Button from "react-bootstrap/Button";
import { VeiculoService, IVeiculo } from "../../services/api/veiculo/VeiculoService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import { ListTable } from "../../components/ListTable";

export const Veiculo = () => {
	const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (UsuarioService.getLogin().permission == "Admin") {
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

		setUpdateList(false);
	}, [updateList]);

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse veículo?")) {
			VeiculoService.deleteById(id).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setUpdateList(true);
				}
			});
		}
	};

	const handleEdit = (id: number): any => {
		navigate(`/add-veiculo/${id}`);
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
			<th>Placa</th>
			<th>Modelo</th>
			<th>Tipo</th>
			<th>Cliente</th>	
			<th>Agendas</th>
			<th></th>
		</tr>);
	const tbody = (
		veiculos.map((veiculo, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{veiculo.placa}</td>
					<td>{veiculo.modelo}</td>
					<td>{veiculo.tipo}</td>
					<td>{getNome(veiculo.id_cliente)}</td>
					<td>{ }</td>
					<td>
						<button onClick={(_) => handleEdit(veiculo.id)}>
							<img src={edit} alt="" />
						</button>
						<button onClick={(_) => handleDelete(veiculo.id)}>
							<img src={trash} alt="" />
						</button>
					</td>
				</tr>
			);
		})
	);

	return (
		<div id="tabela">
			<h2>Veículos</h2>
			<ListTable thead={thead} tbody={tbody} />
			<div id="buttons">
				<Col>
					<Row>
						<Button onClick={(_) => navigate("/add-veiculo")} type="button" size="lg" variant="warning">
							Adicionar veículo
						</Button>
					</Row>
				</Col>
			</div>
		</div>
	);
};
