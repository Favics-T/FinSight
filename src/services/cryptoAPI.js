import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const searchCoins = (query) => {
  return axios.get(`${BASE_URL}/search`, {
    params: { query }
  });
};
