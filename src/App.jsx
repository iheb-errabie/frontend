import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardVendor from './pages/vendor/DashboardVendor';
import DashboardBuyer from './pages/buyer/DashboardBuyer';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './components/vendor/addproduct';
import ListProducts from './components/vendor/listproduct';
import UpdateProduct from './components/vendor/updateproduct';
import AddReview from './components/common/AddReview';
import ManageAdvertisements from './components/advertisement/ManageAdvertisements';
import { Navigate } from 'react-router-dom';
import AdvertisementList from './components/advertisement/AdvertisementList';
import AdvertisementForm from './components/advertisement/AdvertisementForm';
import Products from "./pages/buyer/Products";
import Cart from './pages/buyer/Cart';
import ManageVendors from "./pages/admin/ManageVendors";
import Wishlist from './pages/buyer/Wishlist';
import ManageClients from "./pages/admin/ManageClients";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/manage_clients" element={<ManageClients />} />
          <Route path="/manage_vendors" element={<ManageVendors  />} />
        </Route>

        {/* Vendor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route path="/DashboardVendor" element={<DashboardVendor />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProducts />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/manage_ads" element={<AdvertisementList />} />
          <Route path="/listads" element={<AdvertisementList />} />
          <Route path="/add_ads" element={<AdvertisementForm />} />
        </Route>

        {/* Buyer Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/DashboardBuyer" element={<DashboardBuyer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add_review/:productId" element={<AddReview />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
