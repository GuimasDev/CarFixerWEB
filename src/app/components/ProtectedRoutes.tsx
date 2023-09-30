import { Navigate, Outlet } from "react-router-dom";
import { UsuarioService } from "../services/api/usuario/UsuarioService"

export const ProtectedRoutes = () => {
  const isAllowed = UsuarioService.protect();

  return (
    isAllowed ? <Outlet /> : <Navigate to='/' />
  )
};