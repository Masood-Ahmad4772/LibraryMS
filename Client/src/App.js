import React from "react";
import { RouterProvider } from "react-router";
import CreateRoutes from "./components/Layouts/CreateRoutes";
import { ToastContainer } from "react-toastify";


const App = () => {
  // localStorage.clear()
  const router = CreateRoutes()
  return (
    <>
    <RouterProvider router={router} />
     <ToastContainer position="top-right" autoClose={2000} />
    </>
    
  );
};

export default App;

