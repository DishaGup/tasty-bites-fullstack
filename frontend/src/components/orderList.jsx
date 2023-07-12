// OrderList.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Establish a WebSocket connection
    const socket = io('http://localhost:5000');

    // Listen for the 'order_status_updated' event from the server
    socket.on('order_status_updated', ({ order_id, new_status }) => {
      // Update the order status in your frontend UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === order_id ? { ...order, status: new_status } : order
        )
      );
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch orders from the backend and update the 'orders' state
    fetch('/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Customer Name: {order.customer_name}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
