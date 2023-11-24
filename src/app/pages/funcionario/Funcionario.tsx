import React, { useEffect, useState } from "react";
import styles from "./Funcionario.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { UsuarioService, IUsuario } from "../../services/api/usuario/UsuarioService";
import { ApiException } from "../../services/api/ApiException";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";

export const Funcionario = () => {
	const [funcionario, setFuncionario] = useState<IUsuario>({
		id: 0,
		nome: "",
		cpf: "",
		email: "",
		telefone: "",
		senha: "",
		permission: "Funcionario",
		veiculos: []
	});
	const [nome, setNome] = useState("");
	const [cpf, setCpf] = useState("");
	const [email, setEmail] = useState("");
	const [telefone, setTelefone] = useState("");
	const [senha, setSenha] = useState("");
	const [permission, setPermission] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id !== undefined) {
			setIsEditing(true);
			UsuarioService.getById(parseInt(id)).then((result) => {
				console.log(1);
				if (result instanceof ApiException) {
					alert(result.message);
				} else {
					setFuncionario(result);
					setNome(result.nome);
					setCpf(result.cpf);
					setEmail(result.email);
					setTelefone(result.telefone);
					setSenha(result.senha);
				}
			});
		}
	}, []);

	const handleSubmit = async () => {
		let funcionario: Omit<IUsuario, "id"> = {
			nome: nome,
			cpf: cpf,
			email: email,
			telefone: telefone,
			senha: "",
			permission: "Funcionario",
			veiculos: []
		};

		console.log(funcionario.senha);
		UsuarioService.create(funcionario).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result != null) {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						alert("Cadastro realizado com sucesso!");
						navigate("/funcionarios");
					}
				} else {
					alert("Não foi possível realizar o cadastro");
				}
			}
		});
	};

	const handleEdit = async () => {
		console.log(funcionario);
		let user: IUsuario = {
			id: funcionario.id,
			nome: nome,
			cpf: funcionario.cpf,
			email: funcionario.email,
			telefone: telefone,
			senha: funcionario.senha,
			permission: permission as 'Cliente' | 'Funcionario' | 'Admin',
			veiculos: funcionario.veiculos
		};

		UsuarioService.update(user).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result != null) {
					if (result instanceof ApiException) {
						alert(result.message);
					} else {
						alert("Alteração realizada com sucesso!");
						navigate("/funcionarios");
					}
				} else {
					alert("Não foi possível realizar a alteração");
				}
			}
		});

		setIsEditing(false);
	};

	return (
		<Container id="container">
			<h1>{isEditing ? "Editar Funcionário" : "Novo Funcionário"}</h1>
			<Form id="form">
				<Input
					className="nome"
					name="nome"
					label="Nome"
					type="text"
					placeholder="Digite o seu nome"
					value={nome}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome((e.target as any).value)}
				/>

				<Input
					className="cpf"
					name="cpf"
					label="Cpf"
					type="text"
					placeholder="Digite o seu CPF"
					value={cpf}
					disabled={isEditing}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf((e.target as any).value)}
				/>

				<Input
					className="email"
					name="email"
					label="Email"
					type="text"
					placeholder="Digite seu email"
					value={email}
					disabled={isEditing}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as any).value)}
				/>

				<Input
					className="telefone"
					name="telefone"
					label="Telefone"
					type="text"
					placeholder="Digite seu número de telefone"
					value={telefone}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone((e.target as any).value)}
				/>
				{!isEditing ?
					<Input
						className="senha"
						name="senha"
						label="Senha"
						type="password"
						placeholder={isEditing ? "A senha será gerada automaticamente" : null}
						disabled={isEditing}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha((e.target as any).value)}
					/> : ''}

				{isEditing ?
					<Select
						className='permission'
						id='permission'
						name='permission'
						label='Permissão'
						value={permission}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPermission((e.target as any).value)} >
						<option value="Funcionario">Funcionário</option>
						<option value="Cliente">Cliente</option>
					</Select> : ''}

			</Form>
			{/* <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={(isEditing ? handleEdit : handleSubmit)} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/funcionario')} type="button" size="lg" variant="primary">Voltar</Button>
                    </Row>
                </Col>
            </div> */}
			<div className={styles.buttonArea}>
				<button
					className={styles.cadastrarButton}
					form="form"
					onClick={isEditing ? handleEdit : handleSubmit}
					type="button"
				>
					Cadastrar
				</button>
				<button className={styles.voltarButton} onClick={(_) => navigate("/funcionarios")} type="button">
					Voltar
				</button>
			</div>
		</Container>
	);
};
