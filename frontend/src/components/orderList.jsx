import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

import { backend_url } from "./AddDishForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalDishes, setModalDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const socketRef = useRef(null);

  useEffect(() => {
    // Establish a WebSocket connection
    socketRef.current = io(backend_url);

    // Listen for the 'order_status_updated' event from the server
    socketRef.current.on("order_status_updated", ({ order_id, new_status }) => {
      // Update the order status in your frontend UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === order_id ? { ...order, status: new_status } : order
        )
      );
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleStatusUpdate = (order_id, new_status) => {
    // Send the updated status to the server using socket.io
    socketRef.current.emit("update_status", { order_id, new_status });
  };

  useEffect(() => {
    // Fetch orders from the backend and update the 'orders' state
    fetch(`${backend_url}/orders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleOrderSelection = (e, orderId) => {
    if (e.target.checked) {
      setSelectedOrders((prevSelectedOrders) => [
        ...prevSelectedOrders,
        orderId,
      ]);
    } else {
      setSelectedOrders((prevSelectedOrders) =>
        prevSelectedOrders.filter(
          (selectedOrderId) => selectedOrderId !== orderId
        )
      );
    }
  };

  const handleShowDishes = (dishes) => {
    fetch(`${backend_url}/dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dishIds: dishes }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
     // Log the response to verify it is valid JSON
        setTotalPrice(data.total_price);
        setModalDishes(data.dishes);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching dishes:", error);
      });
  };

  const handleEditDishes = (orderId, currentDishes) => {
    // Navigate to the order edit page or open an edit modal
    console.log("Edit order:", orderId);
    console.log("Current dishes:", currentDishes);
  };

  
  return (
    <div className="order-list-container">
      {orders.map((order) => (
        <div key={order._id} className="order-item">
          <input
            type="checkbox"
            id={order._id}
            checked={selectedOrders.includes(order._id)}
            onChange={(e) => handleOrderSelection(e, order._id)}
          />
          <p className="customer-name">Customer Name: {order.customerName}</p>
          <p className="status">Status: {order.status}</p>
          <div className="button-group">
            <button
              className="status-button"
              onClick={() => handleStatusUpdate(order._id, "preparing")}
            >
              Mark as Preparing
            </button>
            <button
              className="status-button"
              onClick={() => handleStatusUpdate(order._id, "ready")}
            >
              Mark as Ready for Pickup
            </button>
            <button
              className="status-button"
              onClick={() => handleStatusUpdate(order._id, "delivered")}
            >
              Mark as Delivered
            </button>
            <button
              className="action-button"
              onClick={() => handleShowDishes(order.Dishes)}
            >
              Show Dishes
            </button>
            <button
              className="action-button"
              onClick={() => handleEditDishes(order._id)}
            >
              Edit Dishes
            </button>
          </div>
        </div>
      ))}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Dishes</h3>
            {modalDishes.map((dish) => (
              <div key={dish._id}>
                <p>Dish Name: {dish.dish_name}</p>
              </div>
            ))}
            <p> Total price: {totalPrice}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
