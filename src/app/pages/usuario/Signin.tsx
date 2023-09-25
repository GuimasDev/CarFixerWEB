import React, { useState } from 'react';
import "./Signin.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { UsuarioService, IUsuario } from '../../services/api/usuario/UsuarioService';
import { ApiException } from '../../services/api/ApiException';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Input } from '../../components/Input';

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
                <Input className='nome' id='nome' name="nome" label='Nome' type="text" placeholder="Insira seu nome" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome((e.target as any).value)} />
                <Input className='cpf' id='cpf' name="cpf" label='CPF' type="text" placeholder="Insira seu cpf" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf((e.target as any).value)} />
                <Input className='email' id='email' name="email" label='Email' type="email" placeholder="Insira seu email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as any).value)} />
                <Input className='telefone' id='telefone' name="telefone" label='Telefone' type="text" placeholder="Insira seu telefone" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone((e.target as any).value)} />
                <Input className='senha' id='senha' name="senha" label='Senha' type="password" placeholder="Insira sua senha" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha((e.target as any).value)} />
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