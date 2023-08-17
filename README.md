# TastyBites App
<a href="https://tastybites-nine.vercel.app/">Frontend</a>

The heart of the application lies in Flask and Python, which were employed to create key features such as menu management, order processing, and real-time updates. The app is thoughtfully designed to handle user interactions, gracefully address invalid inputs, and handle edge cases with ease. As a result, the staff at TastyBites can seamlessly manage menus, modify dishes, and keep track of order status, ensuring a smooth and delightful experience for customers.

The user interface is designed to be intuitive and user-friendly, with intuitive navigation and robust error handling to ensure smooth operations even in challenging scenarios. Leveraging Flask's powerful routing capabilities, the application enables seamless CRUD operations on menu items, facilitating easy updates and additions to the menu.

## Key Features

- **Chatbot Interaction:** The backend serves as the chatbot engine, responding to user queries and providing helpful and entertaining answers.
- **Menu Access:** Users can retrieve the restaurant's menu, including dish names, prices, and availability.
- **Order Management:** The application supports taking new orders, updating order statuses, and fetching order details.
- **Feedback Submission:** Customers can provide valuable feedback about their experience with the restaurant.

## Getting Started

### Prerequisites

Before running the backend application, make sure you have the following installed on your system:

- Python (3.7 or later)
- MongoDB

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/DishaGup/tasty-bites-fullstack
   ```

3. Install the required Python packages using `pip`:

   ```bash
   pip install -r requirements.txt
   ```

### Configuration

1. Create a `.env` file in the project root directory and set the following environment variables:

   ```dotenv
   MONGO_URL=<your_mongodb_url>
   DATABASE_NAME=<your_database_name>
   OPENAPI_KEY=<your_openai_api_key>
   SECRETKEY=<your_flask_secret_key>
   ```


## Usage

### Running the Application

To start the FastFood Restaurant Chatbot backend, run the following command:

```bash
python app.py || flask run 
```

The application will run on `http://localhost:5000`.

## Endpoints

The backend provides the following endpoints:

- `GET /menu`: Get the restaurant menu.
- `POST /menu`: Add a new dish to the menu (Admin login required).
- `PUT /menu/<dish_id>`: Update a dish in the menu (Admin login required).
- `DELETE /menu/<dish_id>`: Delete a dish from the menu (Admin login required).
- `POST /orders`: Take a new order.
- `PUT /orders/<order_id>`: Update the status of an order.
- `GET /orders`: Get all orders.
- `POST /feedback`: Submit feedback.

## Testing

To run the unit tests for the application, use the following command:

```bash
python test-app.py
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.


## Remarks / Details:
In just three weeks, I embarked on a challenging journey to master three entirely new tech stacks—Vue.js, Flask & Python, and MongoDB—by leveraging the power of prompt engineering and generative AI. The result of this intense learning experience is the impressive web application, TastyBites App, developed in just four days.

<br/>
The journey of mastering new technologies in such a short span has been both challenging and rewarding. I embraced prompt engineering and generative AI to overcome obstacles and create a robust web application for TastyBites. The project showcases the power of AI-driven development and rapid learning, proving that with the right tools and dedication, incredible feats can be achieved in a short time.

## Snapshots 

![homepage](https://github.com/DishaGup/tasty-bites-fullstack/assets/115460391/5bead290-f9a1-4a40-8763-6b7d9ade8a47)

---

![chat-section](https://github.com/DishaGup/tasty-bites-fullstack/assets/115460391/fe0f5b2f-da1d-49b7-b4f8-ccb0e157336c)

