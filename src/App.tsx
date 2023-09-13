import React, { useEffect } from "react";
import { ROUTES, STORAGE_TOKEN } from "./utils/constants";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./pages/ProductDetailPage";
import { userAPI } from "./utils/api";

function App() {
  let token: any;
  const tokenLocalStorage = localStorage.getItem(STORAGE_TOKEN);
  const tokenSessionStorage = sessionStorage.getItem(STORAGE_TOKEN);

  const navigate = useNavigate();

  if (localStorage.getItem(STORAGE_TOKEN)) {
    token = localStorage.getItem(STORAGE_TOKEN);
  } else if (sessionStorage.getItem(STORAGE_TOKEN)) {
    token = sessionStorage.getItem(STORAGE_TOKEN);
  }

  userAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!tokenLocalStorage && !tokenSessionStorage) {
      navigate(ROUTES.login, { replace: true });
    }
  }, []);

  return (
    <Routes>
      <Route path={ROUTES.register} element={<RegisterPage />}></Route>
      <Route path={ROUTES.dashboard} element={<DashboardPage />}></Route>
      <Route path={ROUTES.login} element={<LoginPage />}></Route>
      <Route path={ROUTES.detail} element={<ProductDetail />}></Route>
    </Routes>
  );
}

export default App;
