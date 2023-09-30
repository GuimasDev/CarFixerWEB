import React, { useEffect, useState } from 'react';
import "./Cliente.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { UsuarioService, IUsuario } from '../../services/api/usuario/UsuarioService';
import { ApiException } from '../../services/api/ApiException';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';

export const Cliente = () => {
    const [cliente, setVeiculo] = useState<IUsuario>({
        id: 0,
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        permission: 'Cliente'
    })
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            UsuarioService.getById(parseInt(id)).then((result) => {
                console.log(1);
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    setVeiculo(result);
                    setNome(result.nome);
                    setCpf(result.cpf);
                    setEmail(result.email);
                    setTelefone(result.telefone);
                    setSenha(result.senha);
                }
            })
        }
    }, [])

    const handleSubmit = async () => {
        let cliente: Omit<IUsuario, 'id'> = {
            nome: nome,
            cpf: cpf,
            email: email,
            telefone: telefone,
            senha: UsuarioService.genPassword(),
            permission: 'Cliente'
        };

        console.log(cliente.senha)
        UsuarioService.create(cliente).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Cadastro realizado com sucesso!\nSenha gerada: " + cliente.senha);
                        navigate('/clientes');
                    }
                } else {
                    alert("Não foi possível realizar o cadastro");
                }
            }
        }
        )
    }

    const handleEdit = async () => {
        console.log(cliente);
        let user: IUsuario = {
            id: cliente.id,
            nome: nome,
            cpf: cliente.cpf,
            email: cliente.email,
            telefone: telefone,
            senha: cliente.senha,
            permission: cliente.permission
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
                        navigate('/cliente');
                    }
                } else {
                    alert("Não foi possível realizar a alteração");
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
                <Input className='nome' name="nome" label='Nome' type="text" placeholder="Digite o seu nome" value={nome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome((e.target as any).value)} />

                <Input className='cpf' name="cpf" label='Cpf' type="text" placeholder="Digite o seu CPF" value={cpf} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf((e.target as any).value)} />

                <Input className='email' name='email' label='Email' type="text" placeholder='Digite seu email' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as any).value)} />

                <Input className='telefone' name='telefone' label='Telefone' type="text" placeholder='Digite seu número de telefone' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone((e.target as any).value)} />

                <Input className='senha' name='senha' label='Senha' type="password" placeholder='A senha será gerada automaticamente' disabled onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha((e.target as any).value)} />

            </Form>
            <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={(id !== undefined ? handleEdit : handleSubmit)} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/cliente')} type="button" size="lg" variant="primary">Voltar</Button>
                    </Row>
                </Col>
            </div>
        </Container>

    );

}