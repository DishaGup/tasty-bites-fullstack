import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Dishes from "./Dishes";
import AddDishForm from "./AddDishForm";
import Chatbot from "./Chatbot";
import FeedbackForm from "./FeedbackForm";
import OrderForm from "./orderForm";
import OrderList from "./orderList";
const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dishes />} />

        <Route path="/add-dish" element={<AddDishForm />} />

        <Route path="/chatbot" element={<Chatbot />} />

        <Route path="/feedback" element={<FeedbackForm />} />

        <Route path="/order" element={<OrderForm />} />

        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
