import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/logo.png';

export const Logo = ({ text }) => (
  <div className="d-flex align-items-center mb-4">
    <img src={logo} alt="Escudo" width="40" height="40" />
    <span className="h5 mb-0 ms-2 text-dark">{text}</span>
  </div>
);

Logo.propTypes = {
  text: PropTypes.string.isRequired,
};
