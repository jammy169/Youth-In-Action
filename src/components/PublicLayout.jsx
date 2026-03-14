import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNav from './PublicNav';

const PublicLayout = () => {
  return (
    <>
      <PublicNav />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;
