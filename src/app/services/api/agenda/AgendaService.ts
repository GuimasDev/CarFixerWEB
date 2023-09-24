import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export enum Status {
    Pendente = "Pendente",
    Aprovado = "Aprovado",
    Reprovado = "Reprovado",
    Em_Andamento = "Em_Andamento",
    Concluido = "Concluido",
    Cancelado = "Cancelado"
}

export interface IAgenda {
    id: number;
    id_horario: number;
    id_agenda: number;
    status: Status;
    dt_previsao: Date | undefined;
    dt_fim: Date | undefined;
    observacao: string;
    produtos: any[];
}

const get = async (): Promise<IAgenda[] | ApiException> => {
    try {
        const { data } = await Api().get('/agenda')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IAgenda | ApiException> => {
    try {
        const { data } = await Api().get(`/agenda/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IAgenda, 'id'>): Promise<IAgenda[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/agenda', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const update = async (dataToUpdate: IAgenda): Promise<IAgenda | ApiException> => {
    try {
        const { data } = await Api().put('/agenda', dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/agenda/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const AgendaService = {
    get,
    getById,
    create,
    update,
    deleteById,
};