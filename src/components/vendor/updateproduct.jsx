// components/UpdateProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import Sidebar from '../common/Sidebar';

const UpdateProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', images: [], video: null });
  const [existingMedia, setExistingMedia] = useState({ images: [], video: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const { name, description, price, category, images, video } = res.data;
        setForm({ name, description, price, category, images: [], video: null });
        setExistingMedia({ images, video });
      })
      .catch(() => setError('Failed to fetch product'))
      .finally(() => setLoading(false));
  }, [id]);

  // Update the handleChange function to merge existing and new media
  const handleChange = (e) => {
    const { name, files } = e.target;
    if (name === 'images') {
      const newImages = Array.from(files);
      setForm({ ...form, images: newImages }); // Replace existing images with new ones
    } else if (name === 'video') {
      setForm({ ...form, video: files[0] }); // Replace existing video with the new one
    } else {
      setForm({ ...form, [name]: e.target.value });
    }
  };

  // Update the handleSubmit function to only send new files to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'images' && value.length > 0) {
        value.forEach((file) => {
          if (file instanceof File) { // Only append new files
            data.append('images', file);
          }
        });
      } else if (key === 'video' && value instanceof File) {
        data.append(key, value);
      } else if (value) {
        data.append(key, value);
      }
    });

    try {
      await api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/listproduct');
    } catch {
      setError('Failed to update product');
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;


  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h2>Update Product</h2>
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
            <div className="mt-2">
              {/* Display selected images or existing images */}
              {form.images.length > 0
                ? form.images.map((image, index) => (
                    <Image
                      key={`new-${index}`}
                      src={URL.createObjectURL(image)}
                      thumbnail
                      className="me-2"
                      style={{ width: '100px', height: '100px' }}
                    />
                  ))
                : existingMedia.images.map((image, index) => (
                    <Image
                      key={`existing-${index}`}
                      src={`http://localhost:3000/${image.replace(/\\/g, '/')}`}
                      thumbnail
                      className="me-2"
                      style={{ width: '100px', height: '100px' }}
                    />
                  ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Video</Form.Label>
            <Form.Control type="file" name="video" onChange={handleChange} accept="video/*" />
            <div className="mt-2">
              {/* Display selected video or existing video */}
              {form.video ? (
                <video key={form.video.name} width="200" controls>
                  <source src={URL.createObjectURL(form.video)} type={form.video.type} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                existingMedia.video && (
                  <video width="200" controls>
                    <source src={`http://localhost:3000/${existingMedia.video.replace(/\\/g, '/')}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              )}
            </div>
          </Form.Group>
          <Button type="submit" variant="success">Update</Button>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProduct;
