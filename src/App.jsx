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
import EditProfile from './pages/buyer/EditProfile';
import { Navigate } from 'react-router-dom';
import AdvertisementList from './components/advertisement/AdvertisementList';
import AdvertisementForm from './components/advertisement/AdvertisementForm';
import Products from "./pages/buyer/Products";
import Cart from './pages/buyer/Cart';
import ManageVendors from "./pages/admin/ManageVendors";
import Wishlist from './pages/buyer/Wishlist';
import ManageClients from "./pages/admin/ManageClients";
import ManageAdvertisementsAdmin from './pages/admin/ManageAdvertisementsAdmin';
import { ToastContainer } from "react-toastify";
import VisitorProducts from "./pages/visitor/VisitorProducts";
import OrderHistory from './pages/buyer/OrderHistory';
import Success from './pages/Success'; // <-- Add this import at the top
import ProductPage from './pages/buyer/ProductPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VisitorProductsList from './pages/visitor/VisitorProductsList';
import ProductPageVendor from './pages/vendor/ProductPageVendor';
import AdvertisementUpdate from './components/advertisement/AdvertisementUpdate';
import EditProfileVendor from './pages/vendor/EditProfileVendor';

function App() {
  return (
    <>
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<VisitorProducts />} /> {/* Public/visitor */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} /> 
         <Route path="/visitor_products" element={<VisitorProductsList />} />
          
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password" element={<ResetPassword />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/manage_clients" element={<ManageClients />} />
          <Route path="/manage_vendors" element={<ManageVendors  />} />
          <Route path="/manage_advertisements" element={<ManageAdvertisementsAdmin />} />
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
          <Route path="/update_ads/:id" element={<AdvertisementUpdate />} />
          <Route path="/productvendor/:id" element={<ProductPageVendor />} />
          <Route path="/edit_profile_vendor" element={<EditProfileVendor />} />
        </Route>

        {/* Buyer Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/DashboardBuyer" element={<DashboardBuyer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add_review/:productId" element={<AddReview />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/edit_profile" element={<EditProfile />} />
        </Route>

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router></>

  );
}

export default App;
