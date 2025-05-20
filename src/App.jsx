import React from 'react'
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import DashBoard from './pages/DashBoard';
import Market from './pages/Market';
import WatchList from './pages/WatchList';
import Home from './pages/Home';
import SideBar from './components/SideBar'


const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className='flex flex-1 w-full '>
        <SideBar />
       <div className=" flex-1">
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
          
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App
