import React, { useState } from 'react';
import "./Login.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { UsuarioService } from '../services/api/usuario/UsuarioService';
import { ApiException } from '../services/api/ApiException';
import { Navigate } from 'react-router-dom';

export const Logout = () => {
    UsuarioService.logout();

    return (
        < Navigate to="/login" replace={true} />
    );

}