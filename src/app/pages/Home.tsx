import React from 'react';
import { useState, useEffect } from 'react';
import { ApiException } from '../services/api/ApiException';
import { IUsuario, UsuarioService } from '../services/api/usuario/UsuarioService';

export const Home = () => {
    const [list, setList] = useState<IUsuario[]>([]);

    useEffect(() => {
        UsuarioService.get().then((result) => {
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setList(result);
            }
        }
        )
    }, [])

    return (
        <div>
            <li>
                {list.map((item) => {
                    return (<ul>{item.nome}</ul>)
                })}
            </li>
        </div>
    );

}