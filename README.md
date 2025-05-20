# 📊 FinSight – Real-Time Financial Dashboard

FinSight is a real-time financial dashboard built with React and Chart.js that lets you monitor stock and cryptocurrency prices, trends, and key market metrics in one place. Designed for ease of use and responsiveness, it's ideal for analysts, investors, or anyone who wants to stay updated on the market.

## 🚀 Features

- 🔍 **Search Bar with Autocomplete**  
  Search for stocks and cryptocurrencies with live suggestions as you type.

- 💰 **Crypto Price Display**  
  See current price, 24-hour change, market cap, and trading volume using the CoinGecko API.

- 📈 **Line Chart Visualization**  
  View a 7-day price trend for any selected asset using Chart.js.

- 🌙 **Dark Mode Toggle**  
  Switch between light and dark themes for a better viewing experience.

- 🔄 **Currency Converter (Optional)**  
  Convert crypto prices to multiple fiat currencies.

- ⚖️ **Asset Comparison (Optional)**  
  Compare the trends of two or more assets on a single chart.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js via react-chartjs-2
- **APIs**:
  - [CoinGecko API](https://www.coingecko.com/en/api)
  - [Alpha Vantage API](https://www.alphavantage.co/documentation/) (for stocks)

## 📱 Responsive Design

Fully responsive layout optimized for both mobile and desktop devices.

## 📦 Installation

```bash
git clone https://github.com/your-username/finSight.git
cd finSight
npm install
npm run dev
