import React, { useState } from 'react';
import { UsuarioService } from '../../services/api/usuario/UsuarioService';
import { Navigate } from 'react-router-dom';
import { useUserType } from "../../components/UserTypeContext";



export const Logout = () => {
    UsuarioService.logout();

	const { setUserType } = useUserType();

    setUserType('unsigned')


    return (
        < Navigate to="/login" replace={true} />
    );
}