import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { token, student } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Student role check is based on having student data
  if (!student) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
