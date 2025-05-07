// components/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Sidebar from '../common/Sidebar';
import { Form, Button, Alert } from 'react-bootstrap';

const AddProduct = () => {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', images: [], video: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'images') {
        setForm({ ...form, [name]: Array.from(files) }); // Handle multiple image files
      } else if (name === 'video') {
        setForm({ ...form, [name]: files[0] }); // Handle single video file
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    console.log(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'images' && value.length > 0) {
        value.forEach((file) => data.append('images', file)); // Append multiple images
      } else if (value) {
        data.append(key, value);
      }
    });

    try {
      await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/listproduct');
    } catch {
      setError('Failed to add product');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
          <h2>Add New Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={form.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control name="category" value={form.category} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              <Form.Control type="file" name="images" onChange={handleChange} accept="image/*" multiple />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video</Form.Label>
              <Form.Control type="file" name="video" onChange={handleChange} accept="video/*" />
            </Form.Group>
            <Button type="submit" variant="primary">Add Product</Button>
          </Form>
        </div>
      </div>
 
  );
};

export default AddProduct;
