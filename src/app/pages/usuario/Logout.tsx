import React, { useState } from 'react';
import "./Login.css";
import { UsuarioService } from '../../services/api/usuario/UsuarioService';
import { Navigate } from 'react-router-dom';
import { useUserType } from '../../components/UserTypeContext';

export const Logout = () => {
    UsuarioService.logout();

    return (
        < Navigate to="/login" replace={true} />
    );
}