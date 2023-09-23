import { Api } from "../ApiConfig";
import { ApiException } from "../ApiException";

export interface IUsuario {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    senha: string;
    permission: 'Cliente' | 'Funcionario' | 'Admin';
}

const get = async (): Promise<IUsuario[] | ApiException> => {
    try {
        const { data } = await Api().get('/usuario')
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getById = async (id: number): Promise<IUsuario | ApiException> => {
    try {
        const { data } = await Api().get(`/usuario/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const getByEmail = async (email: any): Promise<IUsuario | ApiException> => {
    try {
        const { data } = await Api().get(`/usuario/email/${email}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const create = async (dataToCreate: Omit<IUsuario, 'id'>): Promise<IUsuario[] | ApiException> => {
    try {
        const { data } = await Api().post<any>('/usuario', dataToCreate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao inserir na API.')
    }
}

const updateById = async (id: number, dataToUpdate: IUsuario): Promise<IUsuario | ApiException> => {
    try {
        const { data } = await Api().put(`/usuario/${id}`, dataToUpdate)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao atualizar na API.')
    }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
    try {
        const { data } = await Api().delete(`/usuario/${id}`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao deletar na API.')
    }
};

const authenticate = async (email: any, senha: any): Promise<number | ApiException> => {
    try {
        const { data } = await Api().get(`/usuario/${email}/${senha}/authenticate`)
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
};

const setLogin = (usuario: IUsuario): void => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

const getLogin = () => {
    let usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    return usuario;
}

const logout = () => {
    localStorage.removeItem('usuario');
}
    
const protect = () => {
    if (getLogin === null) {
        return true;
    } else {
        return false;
    }
}

export const UsuarioService = {
    get,
    getById,
    getByEmail,
    create,
    updateById,
    deleteById,
    authenticate,
    setLogin,
    getLogin,
    logout,
    protect
};