import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/storage";

function ProtectedRoute({ role, children }) {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
