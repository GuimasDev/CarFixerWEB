import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IProduto {
    id: number;
    descricao: string;
}

const get = async (): Promise<IProduto[] | ApiException> => {
    try {
        const { data } = await Api().get('/produto')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IProduto | ApiException> => {
    try {
        const { data } = await Api().get(`/produto/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getByIdAgenda = async (id: number): Promise<IProduto[] | ApiException> => {
    try {
        const { data } = await Api().get(`/agenda/${id}/produto`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IProduto, 'id'>): Promise<IProduto[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/produto', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const update = async (dataToUpdate: IProduto): Promise<IProduto | ApiException> => {
    try {
        const { data } = await Api().put('/produto', dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const putOnAgenda = async (idAgenda: number, idProduto: number): Promise<IProduto | ApiException> => {
    try {
        const { data } = await Api().post(`/agenda/${idAgenda}/produto`, { id: idProduto, id_agenda: idAgenda, observacao: '' })
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/produto/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

const deleteAllFromAgenda = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/agenda/${id}/produto`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

const deleteFromAgenda = async (id: number, idProduto: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/agenda/${id}/produto/${idProduto}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const ProdutoService = {
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