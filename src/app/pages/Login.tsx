import React, { useState } from 'react';
import "./Login.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { UsuarioService } from '../services/api/usuario/UsuarioService';
import { ApiException } from '../services/api/ApiException';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const navigate = useNavigate();

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
                            UsuarioService.setLogin(result);
                            alert("Login realizado com sucesso!");
                            navigate('/');
                        }
                    })
                } else {
                    alert("Login inválido");
                }
            }
        }

        )
    }

    return (
        <Container id='container'>
            <h1>
                Login
            </h1>
            <Form id="form">
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" onChange={e => setEmail((e.target as any).value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupSenha">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="senha" placeholder="Senha" onChange={e => setSenha((e.target as any).value)} />
                </Form.Group>
            </Form>
            <Button form="form" onClick={handleSubmit} type="button" size="lg" color="primary">Login</Button>
        </Container>

    );

}