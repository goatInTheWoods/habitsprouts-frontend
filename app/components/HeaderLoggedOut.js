import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLoggedOut = () => {
  return (
    <Link to="/login" className="col-md-auto">
      <button className="btn btn-outline-secondary btn-sm rounded-0">
        Sign In
      </button>
    </Link>
  );
};

export default HeaderLoggedOut;
