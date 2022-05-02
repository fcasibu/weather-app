import React, { useState } from 'react';
import '../styles/Error.css';

function FallbackErrorComponent({ error, resetErrorBoundary }) {
  const [formValue, setFormValue] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    resetErrorBoundary(formValue);
  }
  return (
    <div className="error">
      <h1>{error.message}</h1>
      <p>Please enter a valid city</p>
      <form onSubmit={handleSubmit} className="error-form">
        <input
          required
          value={formValue}
          onChange={e => setFormValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default FallbackErrorComponent;
