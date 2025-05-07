import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardVendor from './components/DashboardVendor';
import DashboardBuyer from './components/DashboardBuyer';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './components/vendor/addproduct';
import ListProducts from './components/vendor/listproduct';
import UpdateProduct from './components/vendor/updateproduct';
import Cart from './components/cart/Cart';
import AddReview from './components/common/AddReview';
import ManageAdvertisements from './components/advertisement/ManageAdvertisements';
import { Navigate } from 'react-router-dom';
import AdvertisementList from './components/advertisement/AdvertisementList';
import AdvertisementForm from './components/advertisement/AdvertisementForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/manage_clients" element={<div>Manage Clients</div>} />
          <Route path="/manage_vendors" element={<div>Manage Vendors</div>} />
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
          <Route path="/products" element={<div>Product List</div>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add_review/:productId" element={<AddReview />} />
        </Route>

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
