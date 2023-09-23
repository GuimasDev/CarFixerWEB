import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IRegraFuncionamento {
    id: number;
    dias: string;
    diasInt: number[];
    hr_inicio: string;
    hr_termino: string;
}

const get = async (): Promise<IRegraFuncionamento[] | ApiException> => {
    try {
        const { data } = await Api().get('/regra_funcionamento')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IRegraFuncionamento | ApiException> => {
    try {
        const { data } = await Api().get(`/regra_funcionamento/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IRegraFuncionamento, 'id'>): Promise<IRegraFuncionamento[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/regra_funcionamento', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const updateById = async (id: number, dataToUpdate: IRegraFuncionamento): Promise<IRegraFuncionamento | ApiException> => {
    try {
        const { data } = await Api().put(`/regra_funcionamento/${id}`, dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/regra_funcionamento/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

export const RegraFuncionamentoService = {
    get,
    getById,
    create,
    updateById,
    deleteById,
};