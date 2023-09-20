import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";
import { IAgenda } from "../agenda/AgendaService";

export interface IVeiculo {
    id: number;
    placa: string;
    modelo: string;
    tipo: string;
    id_cliente: number;
    agendas: IAgenda[];
}

const get = async (): Promise<IVeiculo[] | ApiException> => {
    try {
        const { data } = await Api().get('/veiculo')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IVeiculo | ApiException> => {
    try {
        const { data } = await Api().get(`/veiculo/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IVeiculo, 'id'>): Promise<IVeiculo[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/veiculo', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const updateById = async (id: number, dataToUpdate: IVeiculo): Promise<IVeiculo | ApiException> => {
    try {
        const { data } = await Api().put(`/veiculo/${id}`, dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/veiculo/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const VeiculoService = {
    get,
    getById,
    create,
    updateById,
    deleteById,
};