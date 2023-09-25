import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IServico {
    id: number;
    nome: string;
    descricao: string;
}

const urlAgenda = (idAgenda: number) =>
    `http://localhost:8087/api/v1/agenda/${idAgenda}/servico`;


const get = async (): Promise<IServico[] | ApiException> => {
    try {
        const { data } = await Api().get('/servico')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IServico | ApiException> => {
    try {
        const { data } = await Api().get(`/servico/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getByIdAgenda = async (id: number): Promise<IServico[] | ApiException> => {
    try {
        const { data } = await Api().get(`/agenda/${id}/servico`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};


const create = async (dataToCreate: Omit<IServico, 'id'>): Promise<IServico[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/servico', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const update = async (dataToUpdate: IServico): Promise<IServico | ApiException> => {
    try {
        const { data } = await Api().put('/servico/', dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};
// id: idServico, id_agenda: idAgenda, observacao: ''

const putOnAgenda = async (idAgenda: number, idServico: number): Promise<IServico | ApiException> => {
    try {
        const { data } = await Api().post(`/agenda/${idAgenda}/servico`, { id: idServico, id_agenda: idAgenda, observacao: '' })
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/servico/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

const deleteAllFromAgenda = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/agenda/${id}/servico`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

const deleteFromAgenda = async (id: number, idServico: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/agenda/${id}/servico/${idServico}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const ServicoService = {
    get,
    getById,
    getByIdAgenda,
    create,
    update,
    putOnAgenda,
    deleteById,
    deleteAllFromAgenda,
    deleteFromAgenda
};