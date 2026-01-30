import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;