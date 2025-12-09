import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0D0F12] flex font-inter text-slate-200">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;