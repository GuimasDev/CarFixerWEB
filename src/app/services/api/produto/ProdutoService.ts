import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IProduto {
    id: number;
    id_agenda: number;
    descricao: string;
}

const get = async (): Promise<IProduto[] | ApiException> => {
    try {
        const { data } = await Api().get('/produto')
        return data;
    } catch (error) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IProduto | ApiException> => {
    try {
        const { data } = await Api().get(`/produto/${id}`)
        return data;
    } catch (error) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IProduto, 'id'>): Promise<IProduto[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/produto', dataToCreate)
        return data;
    } catch (error) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const updateById = async (id: number, dataToUpdate: IProduto): Promise<IProduto | ApiException> => {
    try {
        const { data } = await Api().put(`/produto/${id}`, dataToUpdate)
        return data;
    } catch (error) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/produto/${id}`)
        return data;
    } catch (error) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const ProdutoService = {
    get,
    getById,
    create,
    updateById,
    deleteById,
};