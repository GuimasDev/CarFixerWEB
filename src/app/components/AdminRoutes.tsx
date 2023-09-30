import { Navigate, Outlet } from "react-router-dom";
import { UsuarioService } from "../services/api/usuario/UsuarioService"

export const AdminRoutes = () => {
  const isAllowed = () => {
    if (UsuarioService.getLogin().permission === "Admin") {
      return true;
    } else
      return false;
  };

  return (
    isAllowed() ? <Outlet /> : <Navigate to='/' />
  )
};