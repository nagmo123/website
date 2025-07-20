import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../Cart/CartSidebar';
import WishlistSidebar from '../Wishlist/WishlistSidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <WishlistSidebar />
    </div>
  );
};

export default Layout;