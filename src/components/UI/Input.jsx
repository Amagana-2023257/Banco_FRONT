import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({
  field,
  label,
  value,
  onChangeHandler,
  type,
  showErrorMessage,
  validationMessage,
  onBlurHandler,
  textArea,
}) => {
  const handleChange = (e) => onChangeHandler(e.target.value, field);
  const handleBlur = (e) => onBlurHandler(e.target.value, field);

  return (
    <div className="mb-3">
      <label htmlFor={field} className="form-label">
        {label}
      </label>
      {textArea ? (
        <textarea
          id={field}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={`form-control ${showErrorMessage ? 'is-invalid' : ''}`}
        />
      ) : (
        <input
          id={field}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-control ${showErrorMessage ? 'is-invalid' : ''}`}
        />
      )}
      {showErrorMessage && (
        <div className="invalid-feedback">{validationMessage}</div>
      )}
    </div>
  );
};

Input.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  showErrorMessage: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string.isRequired,
  onBlurHandler: PropTypes.func.isRequired,
  textArea: PropTypes.bool,
};

Input.defaultProps = {
  textArea: false,
};
