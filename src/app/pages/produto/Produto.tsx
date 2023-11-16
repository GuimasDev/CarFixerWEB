import React, { useEffect, useState } from "react";
import styles from "./Produto.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { ProdutoService, IProduto } from "../../services/api/produto/ProdutoService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";

export const Produto = () => {
	const [produto, setProduto] = useState<IProduto>({
		id: 0,
		descricao: ""
	});
	const [descricao, setDescricao] = useState("");

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id !== undefined) {
			ProdutoService.getById(parseInt(id)).then((result) => {
				console.log(1);
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setProduto(result);
					setDescricao(result.descricao);
				}
			});
		}
	}, []);

	const handleEdit = async () => {
		console.log(produto);
		let prod: IProduto = {
			id: produto.id,
			descricao: descricao
		};

		ProdutoService.update(prod).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result != null) {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						alert("Alteração realizada com sucesso!");
						navigate("/produtos");
					}
				} else {
					alert("Não foi possível realizar a alteração");
				}
			}
		});
	};

	return (
		<Container id="container">
			<h1>{id !== undefined ? "Editar Produto" : "Novo Produto"}</h1>
			<Form id="form">
				<Input
					className="descricoa"
					name="descricao"
					label="Descricao"
					type="text"
					placeholder="Digite o seu descricao"
					value={descricao}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao((e.target as any).value)}
				/>
			</Form>

			<div className={styles.buttonArea}>
				<button
					className={styles.cadastrarButton}
					form="form"
					onClick={handleEdit}
					type="button"
				>
					Salvar
				</button>
				<button className={styles.voltarButton} onClick={(_) => navigate("/produtos")} type="button">
					Voltar
				</button>
			</div>
		</Container>
	);
};
