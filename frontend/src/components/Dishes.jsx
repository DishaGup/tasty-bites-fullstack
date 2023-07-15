import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const searchInputRef = useRef(null);

  const ImageContainer = {
    pizza: "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
    dosa: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    Dosa: "https://media.istockphoto.com/id/1156896083/photo/cheese-masala-dosa-recipe-with-sambar-and-chutney-selective-focus.jpg?s=1024x1024&w=is&k=20&c=AGQD2LRbSKtuziKNjI3tUIUAlP9IxyOMskTOSnHayo8=",
    samosa: "https://images.pexels.com/photos/14477873/pexels-photo-14477873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    Samosa: "https://images.pexels.com/photos/9027521/pexels-photo-9027521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tea: "https://images.pexels.com/photos/2659387/pexels-photo-2659387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    chicken: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  };

  useEffect(() => {
    // Fetch dishes from the backend
    fetch("http://localhost:5000/menu")
      .then((response) => response.json())
      .then((data) => {
        setDishes(data);
        setFilteredDishes(data);
      });
  }, []);

  const handleSearch = () => {
    const searchValue = searchInputRef.current.value.toLowerCase();
    if (searchValue.trim() === "") {
      setFilteredDishes(dishes);
    } else {
      const filtered = dishes.filter(
        (dish) => dish.dish_name.toLowerCase().includes(searchValue)
      );
      setFilteredDishes(filtered);
    }
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
      <h1>Welcome to Tasty Bites!</h1>
      <div className="dishes-container">
        <h2 className="dishes-heading">Menu</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by dish name"
            ref={searchInputRef}
            onChange={handleSearch}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul className="dishes-list">
          {filteredDishes.map((dish, index) => (
            <li key={index} className="dish-item">
              <div className="dish-image-container">
                <img src={ImageContainer[dish.dish_name] || getImageByKeyword(dish.dish_name) } alt={dish.dish_name} />
              </div>
              <div className="dish-details">
                <h3 className="dish-name"   >{dish.dish_name}</h3>
                <p className="dish-price">Price: ${dish.price}</p>
                <p className="dish-availability">
                  Availability: {dish.availability ? "Available" : "Not Available"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dishes;
