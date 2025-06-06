import axios from 'axios'

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

export const handleStockSymbolSearch = (keywords) => {
  return axios.get(BASE_URL, {
    params : {
      function: 'SYMBOL_SEARCH',
      keywords,
      apikey : API_KEY
    } 
  });
}

export const fetchStockPrice = (symbol)=>{
  return axios.get(BASE_URL,{
    params:{
      function:"GLOBAL_QUOTE",
      symbol,
      apikey:API_KEY
    },
  });
};

export const fetchExchangeRate = (fromCurrency = 'USD', toCurrency='EUR')=>{
  return axios.get(BASE_URL,{
    params:{
      function:'CURRENCY_EXCHANGE_RATE',
      from_currency:fromCurrency,
      to_currency:toCurrency,
      apikey:API_KEY
    },
  });
}

// console.log('API KEY',API_KEY)

export const getStockQuote = (symbol)=>{
  return axios.get(BASE_URL, {
    params : {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: API_KEY
    }
  })
}

export const getStockDaily = (symbol) => {
  return axios.get(BASE_URL, {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'compact', // or 'full'
      apikey: API_KEY,
    },
  });
};