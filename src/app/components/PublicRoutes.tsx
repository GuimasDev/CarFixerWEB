import { Navigate, Outlet } from "react-router-dom";
import { UsuarioService } from "../services/api/usuario/UsuarioService"

export const PublicRoutes = () => {
  const isAllowed = UsuarioService.protect();

  return (
    isAllowed ? <Navigate to='/' /> : <Outlet />
  )
};