import React, { useState } from 'react';
import "./Signin.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { UsuarioService, IUsuario } from '../services/api/usuario/UsuarioService';
import { ApiException } from '../services/api/ApiException';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

export const Signin = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        let usuario: Omit<IUsuario, 'id'> = {
            nome: nome,
            cpf: cpf,
            email: email,
            telefone: telefone,
            senha: senha,
            permission: 'Cliente'
        };

        UsuarioService.create(usuario).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Cadastro realizado com sucesso!");
                        navigate('/login');
                    }
                } else {
                    alert("Não foi possível realizar o cadastro");
                }
            }
        }
        )
    }

    return (
        <Container id='container'>
            <h1>
                Cadastro
            </h1>
            <Form id="form">
                <Form.Group className="mb-3" controlId="formGroupNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control name="nome" type="text" placeholder="Digite seu nome" onChange={e => setNome((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupCPF">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control name="cpf" type="text" placeholder="Digite seu CPF" onChange={e => setCpf((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Digite seu email" onChange={e => setEmail((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupTelefone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control name="telefone" type="text" placeholder="Digite seu número de telefone" onChange={e => setTelefone((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupSenha">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control name="senha" type="password" placeholder="Digite sua senha" onChange={e => setSenha((e.target as any).value)} />
                </Form.Group>
            </Form>
            <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={handleSubmit} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/login')} type="button" size="lg" variant="warning">Já tenho uma conta</Button>
                    </Row>
                </Col>
            </div>
        </Container>

    );

}