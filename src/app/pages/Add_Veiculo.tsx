import React, { useEffect, useState } from 'react';
import "./Add_Veiculo.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { VeiculoService, IVeiculo } from '../services/api/veiculo/VeiculoService';
import { ApiException } from '../services/api/ApiException';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { UsuarioService } from '../services/api/usuario/UsuarioService';

export const Add_Veiculo = () => {
    const [veiculo, setVeiculo] = useState<IVeiculo>({
        id: 0,
        modelo: '',
        placa: '',
        tipo: '',
        id_cliente: 0,
        agendas: []
    })
    const [modelo, setModelo] = useState('');
    const [placa, setPlaca] = useState('');
    const [tipo, setTipo] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            VeiculoService.getById(parseInt(id)).then((result) => {
                console.log(1);
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    setVeiculo(result);
                    setModelo(result.modelo);
                    setPlaca(result.placa);
                    setTipo(result.tipo);
                }
            })
        }
    }, [])

    const handleSubmit = async () => {
        let veiculo: Omit<IVeiculo, 'id'> = {
            modelo: modelo,
            placa: placa,
            tipo: tipo,
            id_cliente: UsuarioService.getLogin().id,
            agendas: []
        };

        VeiculoService.create(veiculo).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Cadastro realizado com sucesso!");
                        navigate('/veiculo');
                    }
                } else {
                    alert("Não foi possível realizar o cadastro");
                }
            }
        }
        )
    }

    const handleEdit = async () => {
        console.log(veiculo);
        let veic: IVeiculo = {
            id: veiculo.id,
            modelo: modelo,
            placa: placa,
            tipo: tipo,
            id_cliente: veiculo.id_cliente,
            agendas: veiculo.agendas
        };

        VeiculoService.update(veic).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Alteração realizada com sucesso!");
                        navigate('/veiculo');
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
                <Form.Group className="mb-3" controlId="formGroupModelo">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control name="modelo" type="text" placeholder="Digite seu modelo" value={modelo} onChange={e => setModelo((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPlaca">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control name="placa" type="text" placeholder="Digite seu Placa" value={placa} onChange={e => setPlaca((e.target as any).value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupTipo">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select name="tipo" placeholder="Digite seu tipo" value={tipo} onChange={e => setTipo((e.target as any).value)} aria-label="Tipo">
                        <option selected>Escolha o tipo do veículo</option>
                        <option value="Carro">Carro</option>
                        <option value="Moto">Moto</option>
                    </Form.Select>
                </Form.Group>
            </Form>
            <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={(id !== null ? handleEdit : handleSubmit)} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/veiculo')} type="button" size="lg" variant="primary">Voltar</Button>
                    </Row>
                </Col>
            </div>
        </Container>

    );

}