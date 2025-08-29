import { Navigate, Outlet } from "react-router";

const RedirectIfProtected = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    // already logged in → don’t allow /login or /register
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
  // not logged in → allow showing login/register
};

export default RedirectIfProtected;
