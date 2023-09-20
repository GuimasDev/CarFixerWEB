import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IHorario {
    id: number;
    status: 'Livre' | 'Ocupado';
    data: Date;
}

const get = async (): Promise<IHorario[] | ApiException> => {
    try {
        const { data } = await Api().get('/horario')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IHorario | ApiException> => {
    try {
        const { data } = await Api().get(`/horario/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IHorario, 'id'>): Promise<IHorario[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/horario', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const updateById = async (id: number, dataToUpdate: IHorario): Promise<IHorario | ApiException> => {
    try {
        const { data } = await Api().put(`/horario/${id}`, dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/horario/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const HorarioService = {
    get,
    getById,
    create,
    updateById,
    deleteById,
};