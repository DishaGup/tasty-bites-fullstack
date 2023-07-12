// OrderForm.js
import React, { useState, useEffect } from 'react';

const OrderForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [dishOptions, setDishOptions] = useState([]);

  useEffect(() => {
    // Fetch dish options from the backend and update the 'dishOptions' state
    fetch('/menu')
      .then((response) => response.json())
      .then((data) => setDishOptions(data));
  }, []);

  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  const handleDishSelection = (e) => {
    setSelectedDish(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim() === '' || selectedDish === '') {
      // Display error message for invalid form inputs
      return;
    }

    const order = {
      customerName,
      dishId: selectedDish,
    };

    // Submit the order
    fetch('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response, e.g., display success message or handle errors
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="customerName">Customer Name:</label>
      <input
        type="text"
        id="customerName"
        value={customerName}
        onChange={handleNameChange}
        required
        minLength={2}
        maxLength={50}
      />

      <label htmlFor="dishes">Select a Dish:</label>
      <select
        id="dishes"
        value={selectedDish}
        onChange={handleDishSelection}
        required
      >
        <option value="">-- Select a dish --</option>
        {dishOptions.map((dish) => (
          <option key={dish._id} value={dish._id}>
            {dish.dish_name}
          </option>
        ))}
      </select>

      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
