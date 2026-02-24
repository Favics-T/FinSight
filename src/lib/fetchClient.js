import axios from 'axios';

const API_TIMEOUT = 15000;

export const alphaVantageClient = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
  timeout: API_TIMEOUT,
});

export const coinGeckoClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: API_TIMEOUT,
});

const onError = (error) => {
  const message = error?.response?.data?.message || error.message || 'Request failed';
  return Promise.reject(new Error(message));
};

alphaVantageClient.interceptors.response.use((r) => r, onError);
coinGeckoClient.interceptors.response.use((r) => r, onError);

/**
 * @template T
 * @param {Promise<{data: unknown}>} request
 * @param {(data: unknown) => T} parser
 * @returns {Promise<T>}
 */
export async function requestWithParser(request, parser) {
  const response = await request;
  return parser(response.data);
}
