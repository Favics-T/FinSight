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

  //top performing crypto
 export const fetchTopCryptos = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'percent_change_24h_desc', //this indicates it is  sorted by 24h gain
      per_page: 32, //number of coins i am fetching at the moment
      page: 1,
      price_change_percentage: '24h'
    }
  });
  return response.data;
};
