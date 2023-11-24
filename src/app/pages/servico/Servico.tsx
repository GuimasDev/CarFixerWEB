import React, { useEffect, useState } from 'react';
import styles from "./Servico.module.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { ServicoService, IServico } from '../../services/api/servico/ServicoService';
import { ApiException } from '../../services/api/ApiException';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { IUsuario, UsuarioService } from '../../services/api/usuario/UsuarioService';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useUserType } from '../../components/UserTypeContext';

export const Servico = () => {
    const [isEditing, setIsEditing] = useState<boolean>();
    const { userType } = useUserType();
    const [servico, setServico] = useState<IServico>({
        id: 0,
        nome: '',
        descricao: ''
    })
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            setIsEditing(true);
            ServicoService.getById(parseInt(id)).then((result) => {
                console.log(1);
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    setServico(result);
                    setNome(result.nome);
                    setDescricao(result.descricao);
                }
            })
        }
    }, [])

    const handleSubmit = async () => {
        let servico: Omit<IServico, 'id'> = {
            nome: nome,
            descricao: descricao
        };

        ServicoService.create(servico).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Cadastro realizado com sucesso!");
                        navigate('/servicos');
                    }
                } else {
                    alert("Não foi possível realizar o cadastro");
                }
            }
        }
        )
    }

    const handleEdit = async () => {
        console.log(servico);
        let veic: IServico = {
            id: servico.id,
            nome: nome,
            descricao: descricao
        };

        ServicoService.update(veic).then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                if (result != null) {
                    if (result instanceof ApiException) {
                        alert(result.message);
                    } else {
                        alert("Alteração realizada com sucesso!");
                        navigate('/servicos');
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
                {(isEditing ? 'Editar Serviço' : 'Novo Serviço')}
            </h1>
            <Form id="form">
                <Input className='nome' name="nome" label='Nome' type="text" placeholder="Digite o nome do serviço" value={nome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome((e.target as any).value)} />

                <Input className='descricao' name="descricao" label='Descrição' type="text" placeholder="Descreva o serviço" value={descricao} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao((e.target as any).value)} />

            </Form>

            <div className={styles.buttonArea}>
                <button className={styles.cadastrarButton} form="form" onClick={(isEditing ? handleEdit : handleSubmit)} type="button">
                    {(isEditing ? 'Editar' : 'Cadastrar')}
                </button>
                <button className={styles.voltarButton} onClick={_ => navigate('/servicos')} type="button">
                    Voltar
                </button>

            </div>
        </Container >

    );

}