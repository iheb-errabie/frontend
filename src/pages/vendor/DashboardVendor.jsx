import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Button, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { fetchAdvertisements } from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from '../../components/common/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'vendor') {
      navigate('/login');
    }

    const loadAdvertisements = async () => {
      try {
        setLoading(true);
        const response = await fetchAdvertisements();
        setAds(response.data);
      } catch (error) {
        setError('Failed to fetch advertisements');
      } finally {
        setLoading(false);
      }
    };
    loadAdvertisements();
  }, [navigate]);

  // Static example data
  const categoryStats = [
    { category: 'Electronics', buyers: 45, products: 12 },
    { category: 'Clothing', buyers: 32, products: 18 },
    { category: 'Books', buyers: 27, products: 9 },
  ];

  const salesData = {
    labels: categoryStats.map(item => item.category),
    datasets: [
      {
        label: 'Buyers per Category',
        data: categoryStats.map(item => item.buyers),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
      }
    ]
  };

  const productData = {
    labels: categoryStats.map(item => item.category),
    datasets: [
      {
        label: 'Products per Category',
        data: categoryStats.map(item => item.products),
        backgroundColor: ['#4bc0c0', '#9966ff', '#ff9f40'],
      }
    ]
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleViewProducts = () => {
    navigate('/listproduct');
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <Container className="mt-4">
          <h1 className="mb-4">Vendor Dashboard</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Row className="g-4">
              <Col md={6}>
                <Card className="p-3 shadow">
                  <Card.Title>Buyers per Category</Card.Title>
                  <Bar data={salesData} />
                </Card>
              </Col>
              <Col md={6}>
                <Card className="p-3 shadow">
                  <Card.Title>Products Distribution</Card.Title>
                  <Doughnut data={productData} />
                </Card>
              </Col>
              <Col md={12}>
                <Card className="p-3 shadow">
                  <Card.Title>Quick Stats</Card.Title>
                  <ul>
                    <li>Total Products: 39</li>
                    <li>Total Sales: $12,450</li>
                    <li>Average Rating: 4.5/5</li>
                  </ul>
                  <div className="d-flex gap-2 mt-3">
                    <Button variant="primary" onClick={handleViewProducts}>View My Products</Button>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                  </div>
                </Card>
              </Col>
              <Col md={12}>
                <Card className="p-3 shadow">
                  <Card.Title>Your Advertisements</Card.Title>
                  <ul>
                    {ads.map(ad => (
                      <li key={ad._id}>{ad.title}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DashboardVendor;