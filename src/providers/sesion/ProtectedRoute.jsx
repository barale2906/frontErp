import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  isAllowed,
  redirectTo = "/",
  children,
}) => {
  if (!isAllowed) { //Esta permitido
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};