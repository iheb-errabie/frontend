import React from 'react';
import Sidebar from './common/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardBuyer = () => {
  return (
    <div className="d-flex">
      <Sidebar role="buyer" />
      <div className="content flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardBuyer;