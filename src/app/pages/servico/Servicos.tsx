import React, { useEffect, useState } from "react";
import styles from "./Servicos.module.css";
import Button from "react-bootstrap/Button";
import { ServicoService, IServico } from "../../services/api/servico/ServicoService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import gear from "../../assets/icons/gear.svg";
import { ListTable } from "../../components/ListTable";
import { useUserType } from "../../components/UserTypeContext";

export const Servicos = () => {
	const { userType } = useUserType();
	const [servicos, setServicos] = useState<IServico[]>([]);
	const [updateList, setUpdateList] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		ServicoService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				setServicos(result);
			}
		});

		setUpdateList(false);
	}, [updateList]);

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse serviço?")) {
			ServicoService.deleteById(id).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setUpdateList(true);
				}
			});
		}
	};

	const handleEdit = (id: number): any => {
		navigate(`/servico/${id}`);
	};

	const thead = (
		<tr>
			<th>#</th>
			<th>Nome</th>
			<th>Descrição</th>
			<th><img src={gear} alt="" /></th>
		</tr>);
	const tbody = (
		servicos.map((servico, index) => {
			return (
				<tr key={index}>
					<td>{index + 1}</td>
					<td>{servico.nome}</td>
					<td>{servico.descricao}</td>
					<td className={styles.sideButtonArea} >
						<button className={styles.sideButton} onClick={(_) => handleEdit(servico.id)}>
							<img src={edit} alt="" />
						</button>
						<button className={styles.sideButton} onClick={(_) => handleDelete(servico.id)}>
							<img src={trash} alt="" />
						</button>
					</td>
				</tr>
			)
		})
	);

	return (
		<>
			<div className={styles.container}>
				<h2 className={styles.title}>Serviços</h2>
				{(
					servicos.length > 0 ? <div className={styles.table}><ListTable thead={thead} tbody={tbody} /></div> : <p className={styles.info}>Nenhum veículo adicionado!</p>
				)}

				<div className={styles.buttonArea}>
					<button className={styles.button} onClick={(_) => navigate("/servico")} type="button">
						Cadastrar novo serviço
					</button>
				</div>
			</div>
		</>
	);
};
