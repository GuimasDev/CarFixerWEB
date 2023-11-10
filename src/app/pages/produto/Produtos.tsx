import React, { useEffect, useState } from "react";
import styles from "./Produtos.module.css";
import Button from "react-bootstrap/Button";
import { ProdutoService, IProduto } from "../../services/api/produto/ProdutoService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row, Table } from "react-bootstrap";
import edit from "../../assets/icons/edit.svg";
import trash from "../../assets/icons/trash.svg";
import { ListTable } from "../../components/ListTable";
import { Input } from "../../components/Input";

export const Produtos = () => {
	const [produto, setProduto] = useState<IProduto>({
		id: 0,
		descricao: ""
	});
	const [produtos, setProdutos] = useState<IProduto[]>([]);
	const [descricao, setDescricao] = useState("");
	const [updateList, setUpdateList] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState([false, 0])
	const navigate = useNavigate();

	useEffect(() => {
		ProdutoService.get().then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				setProdutos(result);
			}
		});

		setUpdateList(false);
	}, [updateList]);


	const handleSubmit = async () => {
		let produto: Omit<IProduto, "id"> = {
			descricao: descricao
		};
		ProdutoService.create(produto).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result != null) {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						alert("Cadastro realizado com sucesso!");
						window.location.reload();
					}
				} else {
					alert("Não foi possível realizar o cadastro");
				}
			}
		});
	};

	const handleDelete = (id: number): any => {
		if (window.confirm("Tem certeza que deseja excluir esse produto?")) {
			ProdutoService.deleteById(id).then((result) => {
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setUpdateList(true);
				}
			});
		}
	};

	const handleEdit = (id: number): any => {
		setIsEditing([true, id])
		// navigate(`/produto/${id}`);
	};

	const Edit = async () => {
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
						window.location.reload();
					}
				} else {
					alert("Não foi possível realizar a alteração");
				}
			}
		});
	};

	const getNome = (id: number): any => {
		ProdutoService.getById(id).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				return result.descricao;
			}
		});
	};

	const thead = (
		<></>
	);
	// const tbody = produtos.map((produto, index) => {
	const tbody = (
		isEditing[0] ?
			<div className={styles.itemAddedArea} >
				{produtos.map((produto) => (
					produto.id !== isEditing[1] ?	
						<a type="button" className={styles.itemAdded}>
							{produto.descricao}

							<button onClick={(_) => handleEdit(produto.id)}>
								<img src={edit} alt="" />
							</button>
							<button onClick={(_) => handleDelete(produto.id)}>
								<img src={trash} alt="" />
							</button>
						</a>
						:
						
						<a type="button" className={styles.itemAdded}>
							<Form id="form">
								<Input
									className="descricao"
									name="descricao"
									type="text"
									value={descricao}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao((e.target as any).value)}
								/>
							</Form>

							<button onClick={(_) => Edit()}>
								<img src={edit} alt="" />
							</button>
						</a>
				))}
			</div>
			:
			<div className={styles.itemAddedArea} >
				{produtos.map((produto) => (
					// <a type="button" className={styles.itemAdded} onClick={(_) => handleDelete(1)}>
					<a type="button" className={styles.itemAdded}>
						{produto.descricao}
						{/* <span className="bi bi-x-circle"></span> */}
						<button onClick={(_) => handleEdit(produto.id)}>
							<img src={edit} alt="" />
						</button>
						<button onClick={(_) => handleDelete(produto.id)}>
							<img src={trash} alt="" />
						</button>
					</a>
				))}
			</div>
	);

	return (
		<>
			<div id={styles.tabela}>
				<h2 className={styles.title}>Produtos</h2>
				<ListTable thead={thead} tbody={tbody} />

				<div className={styles.buttonArea}>
					<Form id="form">
						<Input id='descricao' name='descricao' type='text' placeholder='Digite o nome do produto' value={descricao} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao((e.target as any).value)} />
						<button className={styles.button} onClick={(_) => handleSubmit()} type="button">
							+
						</button>
					</Form>
				</div>
			</div>
		</>
	);
};
