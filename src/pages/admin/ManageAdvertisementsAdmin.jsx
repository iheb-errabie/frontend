import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { Table, Button, Spinner, Alert, Container, Form, InputGroup } from 'react-bootstrap';
import {
  fetchAdvertisements,
  approveAdvertisement,
  deleteAdvertisement,
} from '../../api';

const ManageAdvertisementsAdmin = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await fetchAdvertisements();
      setAds(res.data);
      console.log(res.data);
    } catch (e) {
      setError('Failed to fetch advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveAdvertisement(id);
      setAds(ads.map(ad => ad._id === id ? { ...ad, status: 'active' } : ad));
    } catch (e) {
      setError('Failed to approve advertisement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvertisement(id);
      setAds(ads.filter(ad => ad._id !== id));
    } catch (e) {
      setError('Failed to delete advertisement');
    }
  };

  const filteredAds = ads.filter(ad => {
    const vendorName = ad.vendor?.username?.toLowerCase() || '';
    const productName = ad.product?.name?.toLowerCase() || '';
    const searchTerm = search.toLowerCase();
    return vendorName.includes(searchTerm) || productName.includes(searchTerm);
  });

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <Container>
          <h2>Manage Advertisements</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
            <Form.Control
              placeholder="Search by vendor or product name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
          {loading ? <Spinner /> : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map(ad => (
                  <tr key={ad._id}>
                    <td>{ad.title}</td>
                    <td>{ad.vendor?.username}</td>
                    <td>{ad.product?.name}</td>
                    <td>{ad.status}</td>
                    <td>{ad.startDate?.slice(0,10)}</td>
                    <td>{ad.endDate?.slice(0,10)}</td>
                    <td>{ad.budget}</td>
                    <td>
                      {ad.status !== 'active' && (
                        <Button size="sm" variant="success" className="me-2" onClick={() => handleApprove(ad._id)}>
                          Approve
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(ad._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ManageAdvertisementsAdmin;
