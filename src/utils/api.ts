import axios from "axios";
import { BASE_URL } from "./constants";

export const userAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: `application/json`,
  },
});

export const getProductFollowCondition = async (
  condition: string,
  token: any
) => {
  const res = await axios.get(`/products?${condition}`);

  return res;
};
