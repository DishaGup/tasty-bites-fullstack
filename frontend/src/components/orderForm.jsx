import React, { useState, useEffect } from 'react';
import { backend_url } from './AddDishForm';
import { ImageContainer } from './Dishes';
import { Star } from 'react-ionicons';

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

  function getImageByKeyword(keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
  
    for (const key in ImageContainer) {
      if (key.toLowerCase() === lowercaseKeyword) {
        return ImageContainer[key];
      }
    }
  
    return null; // If no match found
  }
  return (

  <>     
  <section class="section food-menu" id="food-menu">
    <div class="container">

      <p class="section-subtitle">Popular Dishes</p>

      <h2 class="h2 section-title">
        Our Delicious <span class="span">Foods</span>
      </h2>

      <p class="section-text">
        Food is any substance consumed to provide nutritional support for an organism.
      </p>

      <ul class="fiter-list">

        <li>
          <button class="filter-btn  active">All</button>
        </li>

        <li>
          <button class="filter-btn">Pizza</button>
        </li>

        <li>
          <button class="filter-btn">Burger</button>
        </li>

        <li>
          <button class="filter-btn">Drinks</button>
        </li>

        <li>
          <button class="filter-btn">Sandwich</button>
        </li>

      </ul>
      <form onSubmit={handleSubmit} id='order-form' >
      <ul class="food-menu-list">
      {dishOptions.map((dish) => ( 
        <li>
          <div class="food-menu-card">

            <div class="card-banner">
              <img src={ dish.image || ImageContainer[dish.dish_name] || getImageByKeyword(dish.dish_name) || "https://wp.scoopwhoop.com/wp-content/uploads/2015/04/5677346e6e510a6f3a75b477_5.jpg?resize=1536,1024" } width="300" height="300" loading="lazy"
                alt={dish.dish_name} class="w-100"/>

              <div class="badge">-15%</div>

              <button class="btn food-menu-btn" >
      
              <input
            type="checkbox"
            id={dish._id}
            value={dish._id}
            className="input-field"
            checked={selectedDishes.includes(dish._id)}
            onChange={handleDishSelection}
          /> Order
              </button>
            </div>

            <div class="wrapper">
              <p class="category">{dish.dish_name}</p>

              <div class="rating-wrapper">
               
                <Star color={'hsl(32, 100%, 59%)'}/>
                <Star color={'hsl(32, 100%, 59%)'}/> 
                <Star color={'hsl(32, 100%, 59%)'}/> 
                <Star color={'hsl(32, 100%, 59%)'}/>
                <Star color={'hsl(32, 100%, 59%)'}/>
               
              </div>
            </div>

            <h3 class="h3 card-title">{dish.dish_name}</h3>

            <div class="price-wrapper">

              <p class="price-text">Price:</p>

              <data class="price">${dish.price}.00</data>

              <del class="del" value="69.00">$${dish.price+50}.00</del>

            </div>

          </div>
        </li>    ))}  
        </ul> 
        <div class="input-wrapper"> <label htmlFor="customerName" >Customer Name:</label>
      <input
       className="input-field"
        type="text"
        id="customerName"
        value={customerName}
        onChange={handleNameChange}
        required
        minLength={2}
        maxLength={50}
      />  </div>
       
        <button type="submit" className="btn btn-hover" >Submit Order</button>
        
        </form>  </div> </section> 



   
      

   

     
   </>
  );
};

export default OrderForm;
