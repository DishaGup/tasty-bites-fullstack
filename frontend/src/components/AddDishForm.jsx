import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
export const backend_url="http://localhost:5000"
const AddDishForm = () => {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);
  const {gettokenofheader} = useContext(AuthContext); // Consume the AuthContext
const [image,setimage] =useState('')
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
    e.preventDefault();
    const dishData = {
      dish_name: dishName,
      price: parseFloat(price),
      availability: availability,
      image
    };
  
    try {
      const response = await fetch(`${backend_url}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Admin-power',
        },
        body: JSON.stringify(dishData),
        credentials: 'include'
      });
  
      if (response.ok) {
        alert('Dish added successfully');
      } else {
        alert('Failed to add dish');
        console.error('Failed to add dish');
      }
    } catch (error) {
      console.error(error);
    }
  
    // Reset form inputs
    setDishName('');
    setPrice('');
    setAvailability(true);
    setimage('')
  };

  
  
  return (
    <section class="section section-divider white blog" id="blog">
    <div class="container">
    
        
        
       
          <h2 class="h2 section-title"> Add Dish<span class="span">Form</span>   </h2>
   
     
      <form className="login-form" onSubmit={handleAddDish}>
      <div className="input-wrapper">
        <label htmlFor="dishName" className="add-dish-label">Dish Name:</label>
        <input
          type="text"
          id="dishName"
          value={dishName}
          onChange={handleDishNameChange}
          required
          className="input-field"
        /></div>
  <div className="input-wrapper">
        <label htmlFor="price" className="add-dish-label">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          required
          className="input-field"
        /></div>
  <div className="input-wrapper">
        <label htmlFor="availability" className="add-dish-label">
          <input
            type="checkbox"
            id="availability"
            checked={availability}
            onChange={handleAvailabilityChange}
            className="input-field"
          />
          Available
        </label></div>
        <div className="input-wrapper">
        <label htmlFor="image" className="add-dish-label">
          <input
            type="url"
            id="image"
            name="image"
          
            onChange={(e)=>setimage(e.target.value)}
            className="input-field"
          />
          Available
        </label>


        </div>
        <button type="submit" className="add-dish-button">Add Dish</button>
      </form>
    </div>  </section>
  );
};

export default AddDishForm;
