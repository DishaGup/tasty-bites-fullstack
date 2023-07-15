import React, { useState, useEffect } from 'react';
import { backend_url } from './AddDishForm';

const OrderForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishOptions, setDishOptions] = useState([]);

  useEffect(() => {
    // Fetch dish options from the backend and update the 'dishOptions' state
    fetch(`${backend_url}/menu`)
      .then((response) => response.json())
      .then((data) => setDishOptions(data));
  }, []);

  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  const handleDishSelection = (e) => {
    const dishId = e.target.value;
    if (selectedDishes.includes(dishId)) {
      setSelectedDishes(selectedDishes.filter((id) => id !== dishId));
    } else {
      setSelectedDishes([...selectedDishes, dishId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim() === '' || selectedDishes.length === 0) {
      // Display error message for invalid form inputs
      return;
    }

    const order = {
      customerName,
      Dishes: selectedDishes,
    
    };

    // Submit the order
    fetch(`${backend_url}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {                                                
        console.log(data);
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

      <label>Select Dish(es):</label>
      {dishOptions.map((dish) => (
        <div key={dish._id}>
          <input
            type="checkbox"
            id={dish._id}
            value={dish._id}
           
            checked={selectedDishes.includes(dish._id)}
            onChange={handleDishSelection}
          />
          <label htmlFor={dish._id}>{dish.dish_name}</label>
        </div>
      ))}

      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
