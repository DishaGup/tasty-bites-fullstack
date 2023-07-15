import React, { useEffect, useState ,useRef} from "react";
import io from "socket.io-client";


import { backend_url } from "./AddDishForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalDishes, setModalDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalprice, settotalprice] = useState(0);

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
  
    // Rest of the component code...
  
  
  useEffect(() => {
    // Fetch orders from the backend and update the 'orders' state
    fetch(`${backend_url}/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data));
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
    // Fetch the dish details based on the dish IDs

    fetch(`${backend_url}/dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dishIds: dishes }),
    })
      .then((response) => response.json())
      .then((data) => {
        settotalprice(data.total_price);
        setModalDishes(data.dishes);
        setIsModalOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const handleEditDishes = (orderId, currentDishes) => {
    // Navigate to the order edit page or open an edit modal
    console.log("Edit order:", orderId);
    console.log("Current dishes:", currentDishes);
  };

  //console.log(orders);

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id}>
          <input
            type="checkbox"
            id={order._id}
            checked={selectedOrders.includes(order._id)}
            onChange={(e) => handleOrderSelection(e, order._id)}
          />
          <p>Customer Name: {order.customerName}</p>
          <p>Status: {order.status}</p>
          <button onClick={() => handleStatusUpdate(order._id, "preparing")}>
            Mark as Preparing
          </button>
          <button onClick={() => handleStatusUpdate(order._id, "ready")}>
            Mark as Ready for Pickup
          </button>
          <button onClick={() => handleStatusUpdate(order._id, "delivered")}>
            Mark as Delivered
          </button>
          <button onClick={() => handleShowDishes(order.Dishes)}>
            Show Dishes
          </button>
          <button onClick={() => handleEditDishes(order._id)}>
            Edit Dishes
          </button>
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
            <p> Total price: {totalprice}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
