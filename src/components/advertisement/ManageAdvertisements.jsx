import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdvertisements,
  deleteAdvertisement,
  createAdvertisement,
  updateAdvertisement,
} from '../../api';
import Sidebar from '../common/Sidebar';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Table, Button, Alert, Spinner, Modal, Carousel } from 'react-bootstrap';
const ManageAdvertisements = () => {
  const [ads, setAds] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    product: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editAdId, setEditAdId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdvertisements = async () => {
      try {
        const response = await fetchAdvertisements();
        setAds(response.data);
      } catch (error) {
        console.error('Failed to fetch advertisements:', error);
      }
    };
    loadAdvertisements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAdvertisement(id);
      setAds(ads.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error('Failed to delete advertisement:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateAdvertisement(editAdId, formData);
        setAds(
          ads.map((ad) => (ad._id === editAdId ? { ...ad, ...formData } : ad))
        );
      } else {
        const response = await createAdvertisement(formData);
        setAds([...ads, response.data]);
      }
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        product: '',
      });
      setIsEditing(false);
      setEditAdId(null);
    } catch (error) {
      console.error('Failed to save advertisement:', error);
    }
  };

  const handleEdit = (ad) => {
    setFormData(ad);
    setIsEditing(true);
    setEditAdId(ad._id);
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h1 className="text-center mb-4">Manage Advertisements</h1>
        <form onSubmit={handleSubmit} className="mb-4">
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
          <div className="mb-3">
            <label htmlFor="product" className="form-label">Product ID</label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter product ID"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update' : 'Create'} Advertisement
          </button>
        </form>
        <Button variant="primary" onClick={() => navigate('/listads')}>List ads</Button>

        <ul className="list-group">
          {ads.map((ad) => (
            <li key={ad._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{ad.title}</h5>
                <p>{ad.description}</p>
                <small>Start Date: {ad.startDate}</small><br />
                <small>End Date: {ad.endDate}</small><br />
                <small>Budget: {ad.budget}</small>
              </div>
              <div>
                <button onClick={() => handleEdit(ad)} className="btn btn-warning btn-sm me-2">Edit</button>
                <button onClick={() => handleDelete(ad._id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageAdvertisements;