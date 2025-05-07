import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAdvertisement, updateAdvertisement, fetchAdvertisementById, fetchProductsByVendor } from '../../api';
import Sidebar from '../common/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdvertisementForm = () => {
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
    const loadProducts = async () => {
      try {

        const user = JSON.parse(localStorage.getItem('user'));
        const vendorId = user?.userId;
        console.log('Vendor ID:', vendorId); // Debugging line
        const response = await fetchProductsByVendor(vendorId);
        console.log('Fetched products:', response.data); // Debugging line
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    loadProducts();

    if (id) {
      const loadAdvertisement = async () => {
        try {
          const response = await fetchAdvertisementById(id);
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch advertisement:', error);
        }
      };
      loadAdvertisement();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateAdvertisement(id, formData);
      } else {
        await createAdvertisement(formData);
      }
      navigate('/listads');
    } catch (error) {
      console.error('Failed to save advertisement:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h1 className="text-center mb-4">{id ? 'Edit Advertisement' : 'Create Advertisement'}</h1>
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
              placeholder="Enter advertisement title"
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
              placeholder="Enter advertisement description"
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
              placeholder="Enter budget"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AdvertisementForm;