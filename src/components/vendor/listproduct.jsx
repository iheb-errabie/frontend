import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Table, Button, Alert, Spinner, Modal, Carousel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Sidebar from '../common/Sidebar';


const menuItems = [
  { name: 'Dashboard', path: '/DashboardVendor', icon: 'bi-house' },
  { name: 'List Products', path: '/listproduct', icon: 'bi-list' },
  { name: 'Add Product', path: '/addproduct', icon: 'bi-plus-circle' },
];


const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMedia, setModalMedia] = useState([]);
  const videoRefs = useRef([]); // Ref to store video elements
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const vendorId = user?.userId;
        const response = await api.get(`/products/vendor/${vendorId}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));

        Swal.fire(
          'Deleted!',
          'The product has been deleted.',
          'success'
        );
      } catch (err) {
        setError('Failed to delete product');
        Swal.fire(
          'Error!',
          'There was an error deleting the product.',
          'error'
        );
      }
    }
  };

  const handleMediaClick = (images, video) => {
    const media = [
      ...images.map(image => ({
        type: 'image',
        src: image
      })),
      ...(video ? [{
        type: 'video',
        src: video
      }] : [])
    ];
    setModalMedia(media);
    setShowModal(true);
  };

  const handleSlideChange = (eventKey) => {
    // Pause all videos
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });

    // Play the current video if it exists
    const currentMedia = modalMedia[eventKey];
    if (currentMedia && currentMedia.type === 'video') {
      const videoElement = videoRefs.current[eventKey];
      if (videoElement) videoElement.play();
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;


  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h2>Product List</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Media</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td style={{ position: 'relative' }}>
                  {product.images && product.images.length > 0 && (
                    <img
                      src={`${product.images[0]}`}
                      alt="Product"
                      thumbnail="true"
                      width={100}
                      onClick={() => handleMediaClick(product.images, product.video)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {product.images && product.images.length > 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 30,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      <i className="bi bi-images"></i> {/* Bootstrap icon for multiple images */}
                    </span>
                  )}
                  {product.video && (
                    <span
                      style={{
                        position: 'absolute',
                        top: product.images && product.images.length > 1 ? 5 : 0,
                        right: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      <i className="bi bi-camera-video"></i> {/* Bootstrap icon for video */}
                    </span>
                  )}
                  {!product.video && product.images && product.images.length === 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      <i className="bi bi-image"></i> {/* Bootstrap icon for single image */}
                    </span>
                  )}
                </td>
                <td className="clickable text-primary font-weight-bold"
                 onClick={() => navigate(`/productvendor/${product._id}`)} >{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <Button variant="warning" onClick={() => navigate(`/updateproduct/${product._id}`)} className="me-2">Update</Button>
                  <Button variant="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={() => navigate('/addproduct')}>Add New Product</Button>

        {/* Modal for media carousel */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body>
            <Carousel
              interval={null}
              onSlide={handleSlideChange}
            >
              {modalMedia.map((media, index) => (
                <Carousel.Item key={index}>
                  {media.type === 'image' ? (
                    <img src={media.src} alt={`Slide ${index}`} className="d-block w-100" />
                  ) : (
                    <video
                      controls
                      className="d-block w-100"
                      ref={el => videoRefs.current[index] = el} // Store video element in ref
                      onClick={(e) => e.stopPropagation()} // Prevent carousel navigation on video control click
                    >
                      <source src={media.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ListProducts;
