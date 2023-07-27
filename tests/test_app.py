# Import necessary modules and classes
from app import app, db
import unittest
from flask_testing import TestCase
import sys
import os

# Get the parent directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

# Add the parent directory to the Python module search path
sys.path.insert(0, parent_dir)

# Import the app module

# Define a test class inheriting from Flask's TestCase
class TestApp(TestCase):

    # Method to create the Flask app for testing
    def create_app(self):
        app.config['TESTING'] = True
        app.config['MONGO_URL'] = '<write_your_mongoDB_url>'
        app.config['DATABASE_NAME'] = 'zesty_zomato'
        # Additional app configurations for testing
        return app

    # Method to set up before each test
    def setUp(self):
        self.client = self.app.test_client()
        # Set up test data if needed

    # Method to clean up after each test
    def tearDown(self):
        # Clean up test data if needed
        pass

    # Test for the home route
    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'Hello, Flask!')

    # Test for the chatbot interaction route
    def test_chatbot_interaction(self):
        data = {'message': 'Hello'}
        response = self.client.post('/chatbot', json=data)
        self.assertEqual(response.status_code, 200)
        # Add more assertions for the expected response

    # Test for the get menu route
    def test_get_menu(self):
        response = self.client.get('/menu')
        self.assertEqual(response.status_code, 200)
        # Add assertions to validate the menu data

    # Test for adding a dish to the menu
    def test_add_dish(self):
        data = {'dish_name': 'Pizza', 'price': 10, 'availability': True}
        response = self.client.post('/menu', json=data)
        self.assertEqual(response.status_code, 200)
        # Verify the dish is added to the menu

    # Test for updating a dish in the menu
    def test_update_dish(self):
        dish_id = '64aea85eb4b201784b1828a9'
        data = {'dish_name': 'New Pizza Name'}
        response = self.client.put(f'/menu/{dish_id}', json=data)
        self.assertEqual(response.status_code, 200)
        # Verify the dish is updated
        # Add more test methods for other routes and functionalities

    # Test for deleting a dish from the menu
    def test_delete_dish(self):
        dish_id = '64aea85eb4b201784b1828a9'
        response = self.client.delete(f'/menu/{dish_id}')
        self.assertEqual(response.status_code, 200)
        # Verify the dish is deleted

    # Test for taking a new order
    def test_take_order(self):
        data = {'customerName': 'John Doe', 'Dishes': ['dish_id1', 'dish_id2']}
        response = self.client.post('/orders', json=data)
        self.assertEqual(response.status_code, 200)
        # Verify the order is taken successfully

    # Test for updating the order status
    def test_update_order_status(self):
        order_id = '64b00397b6226b68b8326946'
        data = {'order_id': order_id, 'new_status': 'preparing'}
        response = self.client.post('/orders', json=data)
        self.assertEqual(response.status_code, 200)
        # Verify the order status is updated successfully

    # Test for updating an order
    def test_update_order(self):
        order_id = '64b00397b6226b68b8326946'
        data = {'customerName': 'Updated Customer Name'}
        response = self.client.put(f'/orders/{order_id}', json=data)
        self.assertEqual(response.status_code, 200)
        # Verify the order is updated successfully

    # Test for getting all orders
    def test_get_orders(self):
        response = self.client.get('/orders')
        self.assertEqual(response.status_code, 200)
        # Add assertions to validate the orders data


# Run the tests if the script is executed directly
if __name__ == '__main__':
    unittest.main()
