import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import CustomDesign from './pages/CustomDesign';
import About from './pages/About';
import Dashboard from './pages/Admin/Dashboard';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="custom-design" element={<CustomDesign />} />
            <Route path="about" element={<About />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;