import React, { useState } from 'react';
export const backend_url="http://localhost:5000"
const AddDishForm = () => {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);

  const handleDishNameChange = (e) => {
    setDishName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.checked);
  };

  const handleAddDish = async (e) => {
    e.preventDefault()
    const dishData = {
      dish_name: dishName,
      price: parseFloat(price),
      availability: availability,
    };

    try {
      const response = await fetch(`${backend_url}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      });
       
      if (response.ok) {
     
        alert('Dish added successfully');
      } else {
        // Handle the case when the dish couldn't be added
        // Display an error message or perform appropriate error handling
        alert('Failed to add dish');
        console.error('Failed to add dish');
      }
    } catch (error) {
      // Handle any network or server error
      console.error(error);
    }
      // Reset form inputs
      setDishName('');
      setPrice('');
      setAvailability(true);
  };
  return (
    <div className="add-dish-form">
      <h2 className="add-dish-heading">Add Dish</h2>
      <form onSubmit={handleAddDish}>
        <label htmlFor="dishName" className="add-dish-label">Dish Name:</label>
        <input
          type="text"
          id="dishName"
          value={dishName}
          onChange={handleDishNameChange}
          required
          className="add-dish-input"
        />

        <label htmlFor="price" className="add-dish-label">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          required
          className="add-dish-input"
        />

        <label htmlFor="availability" className="add-dish-label">
          <input
            type="checkbox"
            id="availability"
            checked={availability}
            onChange={handleAvailabilityChange}
            className="add-dish-checkbox"
          />
          Available
        </label>

        <button type="submit" className="add-dish-button">Add Dish</button>
      </form>
    </div>
  );
};

export default AddDishForm;
