import React from 'react'
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import DashBoard from './pages/DashBoard';
import Market from './pages/Market';
import WatchList from './pages/WatchList';
import Home from './pages/Home';
import SideBar from './components/SideBar'
import StockDashboard from './pages/StockDashboard';
import CryptoDashboard from './pages/CryptoDashboard';
import DashboardHeader from './components/DashboardHeader';
import CryptoDetail from './pages/CryptoDetail';
import StockDetail from './pages/StockDetail';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className='flex flex-1 w-full '>
        <SideBar />
       <div className=" px-10 flex-1">
        <DashboardHeader />
 <Outlet />
       </div>
       
      </div>
      
    </div>
  );
};


const App = () => {
  return (
    <div>
      
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="market" element={<Market />} />
          <Route path="watchlist" element={<WatchList />} />
          <Route path='stockdashboard' element={<StockDashboard />} />
          <Route path='cryptodashboard' element={<CryptoDashboard />}/>
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          <Route path='/stock/:symbol' element={<StockDetail />}/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App
