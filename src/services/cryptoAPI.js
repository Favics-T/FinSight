import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const searchCoins = (query) => {
  return axios.get(`${BASE_URL}/search`, {
    params: { query }
  });
 
};

export const fetchCryptoMarketChart = (coinId = 'bitcoin',vsCurrency = 'usd', days= 7) => {
  return axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: vsCurrency,
      days,
    },
  });
};



//detailed market for specific coin
  export const fetchMarketData = (coinIds =['bitcoin','etherum','solana'])=>{
    return axios.get(`${BASE_URL}/coins/markets`,{
      params:{
        vs_currency: 'usd',
      ids: coinIds.join(','),
      order: 'market_cap_desc',
      per_page: coinIds.length,
      page: 1,
      sparkline: false
      }
    })
  }
