import React, { useEffect, useState } from 'react';
import styles from "./Add_Veiculo.module.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { VeiculoService, IVeiculo } from '../../services/api/veiculo/VeiculoService';
import { ApiException } from '../../services/api/ApiException';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { UsuarioService } from '../../services/api/usuario/UsuarioService';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';

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
                        navigate('/veiculos');
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
                        navigate('/veiculos');
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
            {(id !== undefined ? 'Editar Veículo' : 'Novo Veículo')}
            </h1>
            <Form id="form">
                <Input className='modelo' name="modelo" label='Modelo' type="text" placeholder="Digite o modelo do veículo" value={modelo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModelo((e.target as any).value)} />

                <Input className='placa' name="placa" label='Placa' type="text" placeholder="Digite a Placa do veículo" value={placa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaca((e.target as any).value)} />

                <Select className='tipo' id='tipo' name='tipo' label='Tipo' defaultValue={id !== undefined ? undefined : 'Informe o tipo do veículo'} value={tipo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTipo((e.target as any).value)} >
                    <option value="Carro">Carro</option>
                    <option value="Moto">Moto</option>
                </Select>

            </Form>
            {/* <div id="buttons">
                <Col>
                    <Row>
                        <Button form="form" onClick={(id !== undefined ? handleEdit : handleSubmit)} type="button" size="lg" variant="success">Cadastrar</Button>
                    </Row>
                    <Row>
                        <Button onClick={_ => navigate('/veiculo')} type="button" size="lg" variant="primary">Voltar</Button>
                    </Row>
                </Col>
            </div> */}
            <div className={styles.buttonArea}>
                <button className={styles.cadastrarButton} form="form" onClick={(id !== undefined ? handleEdit : handleSubmit)} type="button">
                {(id !== undefined ? 'Editar' : 'Cadastrar')}
				</button>
				<button className={styles.voltarButton} onClick={_ => navigate('/veiculos')} type="button">
                Voltar
				</button>
				
			</div>
        </Container>

    );

}