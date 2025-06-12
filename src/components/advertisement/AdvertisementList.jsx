import React, { useEffect, useState } from 'react';
import { fetchAdvertisements, deleteAdvertisement } from '../../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdvertisementList = () => {
  const [ads, setAds] = useState([]);
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
      setAds(ads.filter(ad => ad._id !== id));
    } catch (error) {
      console.error('Failed to delete advertisement:', error);
    }
  };

  const getStatusChip = (status) => {
    const statusStyles = {
      active: { backgroundColor: 'green', color: 'white' },
      pending: { backgroundColor: 'orange', color: 'white' },
    };

    return (
      <span
        style={{
          ...statusStyles[status],
          padding: '0.2em 0.5em',
          borderRadius: '0.5em',
          fontSize: '0.8em',
          marginLeft: '0.5em',
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="content flex-grow-1 p-4">
        <h1 className="text-center mb-4">Advertisements</h1>
        <button
          onClick={() => navigate('/add_ads')}
          className="btn btn-primary mb-4"
        >
          Create New Advertisement
        </button>
        <ul className="list-group">
          {ads.map(ad => (
            <li key={ad._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>
                  {ad.title}
                  {getStatusChip(ad.status)}
                </h5>
                <p>{ad.description}</p>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/update_ads/${ad._id}`)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvertisementList;