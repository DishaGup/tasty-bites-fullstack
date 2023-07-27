import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Dishes from "./Dishes";
import AddDishForm from "./AddDishForm";
import Chatbot from "./Chatbot";
import FeedbackForm from "./FeedbackForm";
import OrderForm from "./orderForm";
import OrderList from "./orderList";
import Login from "./Login";
import HomePage from "../Pages/HomePage";
const AllRoutes = () => {
  return (
    <div>
      <Routes>
         <Route path="/" element={<HomePage />} /> 
        <Route path="/menu" element={<Dishes />} />


        <Route path="/add-dish" element={<AddDishForm />} />

        <Route path="/chatbot" element={<Chatbot />} />

        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order" element={<OrderForm />} />

        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
