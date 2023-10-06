import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { UsuarioService } from "../../services/api/usuario/UsuarioService";
import { ApiException } from "../../services/api/ApiException";
import { Navigate, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Input } from "../../components/Input";
import { useUserType } from "../../components/UserTypeContext";

export const Login = () => {
	const [email, setEmail] = useState();
	const [senha, setSenha] = useState();
	const navigate = useNavigate();

	const { setUserType } = useUserType();

	const handleSubmit = async () => {
		UsuarioService.authenticate(email, senha).then((result) => {
			if (result instanceof ApiException) {
				alert(result.message);
			} else {
				if (result === 200) {
					UsuarioService.getByEmail(email).then((result) => {
						if (result instanceof ApiException) {
							alert(result.message);
						} else {
							console.log(result);
							UsuarioService.setLogin(result);

							// Define o tipo de usuário no contexto global
							setUserType(UsuarioService.getLogin().permission);
							alert("Login realizado com sucesso!");
							navigate("/");
						}
					});
				} else {
					alert("Login inválido");
				}
			}
		});
	};

	return (
		<Container id="container">
			<h1>Login</h1>
			<Form id="form">
				<Input
					className={styles.email}
					id="email"
					name="email"
					label="Email"
					type="email"
					placeholder="Insira seu email"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as any).value)}
				/>
				<Input
					className={styles.senha}
					id="senha"
					name="senha"
					label="Senha"
					type="password"
					placeholder="Insira sua senha"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha((e.target as any).value)}
				/>
			</Form>
			{/* <div id="buttons">
				<Col>
					<Row>
						<Button form="form" onClick={handleSubmit} type="button" size="lg" variant="primary">
							Login
						</Button>
					</Row>
					<Row>
						<Button onClick={(_) => navigate("/signin")} type="button" size="lg" variant="warning">
							Cadastrar
						</Button>
					</Row>
				</Col>
			</div> */}
			<div className={styles.buttonArea3}>
				<button className={styles.loginButton} form="form" onClick={handleSubmit} type="button">
					Login
				</button>
				<button className={styles.cadastrarButton} type="button" onClick={(_) => navigate("/signin")}>
					Cadastrar
				</button>
			</div>
			<p>
				Voltar para a <a href="/">página principal</a>
			</p>
		</Container>
	);
};
