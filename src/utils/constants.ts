export const STORAGE_TOKEN = "token";
export const BASE_URL = "http://localhost:3333";
export const URL_PRODUCTS = "/products";
export const URL_UPLOADFILE = "/upload";
export const URL_LOGIN = "/auth/users";
export const URL_REGISTER = "/users";

export const ROUTES = {
  dashboard: "/",
  register: "/register",
  login: "/login",
  detail: "/detail/:id",
};

export const VALIDATE = {
  regexEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  regexPassword:
    /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[A-Z])(?=.*[0-9])(?=.{11,}).*$/,
  regexPrice: /^\d+$/,
};
