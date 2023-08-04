import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HeaderLoggedOut = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && (
        <Link to="/login" className="col-md-auto">
          <button className="btn btn-outline-secondary btn-sm rounded-0">
            Sign In
          </button>
        </Link>
      )}
    </>
  );
};

export default HeaderLoggedOut;
