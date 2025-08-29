import { createBrowserRouter } from "react-router";
import NonAuthLayout from "./NonAuthLayout";
import { privateRoutes, publicRoutes, authRoutes } from "./allRoutes";

import RedirectIfProtected from "./RedirectIfProtected";
import ProtectedRoute from "./ProtectedRoute";
const CreateRoutes = () => {
  const publicLayout = {
    element: <NonAuthLayout />,
    children: publicRoutes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  };

  const authProtectedLayout = {
    element: <ProtectedRoute />, // 🔥 wrap first
    children: [
      {
        element: <NonAuthLayout />, // 🔥 actual UI layout
        children: privateRoutes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      },
    ],
  };

  const authLayout = {
    element: <RedirectIfProtected />,
    children: [
      {
        element: <NonAuthLayout />,
        children: authRoutes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      },
    ],
  };

  return createBrowserRouter([publicLayout, authProtectedLayout, authLayout]);
};

export default CreateRoutes;
