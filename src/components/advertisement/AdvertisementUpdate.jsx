import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAdvertisement, fetchAdvertisementById, fetchProductsByVendor } from '../../api';
import Sidebar from '../common/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdvertisementUpdate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    productId: ''
  });
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no ID is provided
    if (!id) {
      navigate('/listads');
      return;
    }

    const loadData = async () => {
      try {
        // Load the advertisement data
        const adResponse = await fetchAdvertisementById(id);
        
        // Format dates for form inputs
        const advertisement = {
          ...adResponse.data,
          startDate: adResponse.data.startDate.split('T')[0],
          endDate: adResponse.data.endDate.split('T')[0]
        };
        setFormData(advertisement);

        // Load products
        const user = JSON.parse(localStorage.getItem('user'));
        const vendorId = user?.userId;
        const productsResponse = await fetchProductsByVendor(vendorId);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        navigate('/listads');
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdvertisement(id, formData);
      navigate('/listads');
    } catch (error) {
      console.error('Failed to update advertisement:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h1 className="text-center mb-4">Edit Advertisement</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="productId" className="form-label">Product</label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="" disabled>Select a Product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="budget" className="form-label">Budget</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Advertisement</button>
        </form>
      </div>
    </div>
  );
};

export default AdvertisementUpdate;
