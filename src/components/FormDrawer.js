import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaSearch, FaArrowDown } from 'react-icons/fa';
import useWeather from '../hooks/useWeather';

function FormDrawer({ closeDrawer, changeLocation }) {
  const [formValue, setFormValue] = useState('');
  const [hide, setHide] = useState(true);
  const { cache } = useWeather();

  function handleSubmit(event) {
    event.preventDefault();
    changeLocation(formValue);
  }

  function handleOptionClick(event) {
    const location = event.target.id;
    changeLocation(location);
  }

  function renderOptions() {
    return Object.keys(cache).map(location => {
      return (
        <div id={location} onClick={handleOptionClick} key={location}>
          {location}
        </div>
      );
    });
  }

  return (
    <div className="drawer">
      <div className="close-btn" onClick={closeDrawer}>
        X
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <IconContext.Provider value={{ className: 'search-icon' }}>
            <FaSearch />
          </IconContext.Provider>
          <input
            value={formValue}
            onChange={e => setFormValue(e.target.value)}
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <div className="dropdown">
        <button onClick={() => setHide(!hide)} className="dropdown-btn">
          Previous Searches
        </button>
        <IconContext.Provider
          value={{
            className: 'dropdown-arrow',
            style: hide
              ? { transform: 'rotate(180deg)' }
              : { transform: 'rotate(0deg)' },
            style: { pointerEvents: 'none' }
          }}
        >
          <FaArrowDown />
        </IconContext.Provider>
        {hide && <div className="dropdown-option">{renderOptions()}</div>}
      </div>
    </div>
  );
}

export default FormDrawer;
