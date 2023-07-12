import { Link, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Dishes from "./Dishes";

const HomePage = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/add-dish">Add Dish</Link>
          </li>
          <li>
            <Link to="/chatbot">Chatbot</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
          <li>
            <Link to="/order">Place Order</Link>
          </li>
          <li>
            <Link to="/orders">Order List</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default HomePage;
