import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    // Fetch dishes from the backend
    fetch("http://localhost:5000/menu")
      .then((response) => response.json())
      .then((data) => setDishes(data));
  }, []);
  
  return (
    <>  <h1>Welcome to Tasty Bites!</h1>  
    <div className="dishes-container">
      <h2 className="dishes-heading">Menu</h2>
      <ul className="dishes-list">
        {dishes &&
          dishes.map((dish) => (
            <li key={dish._id} className="dish-item">
              <h3 className="dish-name">{dish.dish_name}</h3>
              <p className="dish-price">Price: ${dish.price}</p>
              <p className="dish-availability">
                Availability:{" "}
                {dish.availability ? "Available" : "Not Available"}
              </p>
            </li>
          ))}
      </ul>
    </div>  </>
  );
};

export default Dishes;
