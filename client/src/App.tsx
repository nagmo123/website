import React, { useEffect } from 'react';
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
import AdminLayout from './components/Layout/AdminLayout';
import AdminIndex from './pages/Admin';
import AbandonedCarts from './pages/Admin/AbandonedCarts';
import ProductInsights from './pages/Admin/ProductInsights';
import ProductArrangement from './pages/Admin/ProductArrangement';
import MediaManagement from './pages/Admin/MediaManagement';
import UserAccessControl from './pages/Admin/UserAccessControl';
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLogin from './pages/Admin/AdminLogin';
import RequireAdmin from './components/Layout/RequireAdmin';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  useEffect(() => {
    useAuthStore.getState().fetchSession();
  }, []);
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
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminIndex />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="abandoned-carts" element={<AbandonedCarts />} />
            <Route path="insights" element={<ProductInsights />} />
            <Route path="arrange" element={<ProductArrangement />} />
            <Route path="media" element={<MediaManagement />} />
            <Route path="access" element={<UserAccessControl />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;