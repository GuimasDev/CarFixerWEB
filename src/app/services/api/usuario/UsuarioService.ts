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

const update = async (dataToUpdate: IUsuario): Promise<IUsuario | ApiException> => {
    try {
        const { data } = await Api().put('/usuario/', dataToUpdate)
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
    localStorage.removeItem('userType');
    localStorage.removeItem('usuario');
}

const protect = () => {
    const usuario = getLogin();

    if (usuario !== null) {
        return true; // Usuario esta logado
    } else {
        return false; // Usuario nao esta logado
    }
}

const genPassword = () => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

export const UsuarioService = {
    get,
    getById,
    getByEmail,
    create,
    update,
    deleteById,
    authenticate,
    setLogin,
    getLogin,
    logout,
    protect,
    genPassword
};