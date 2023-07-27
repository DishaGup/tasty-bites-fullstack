from flask import Flask, jsonify, request, session,redirect, url_for
import unittest
from flask_testing import TestCase

from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO, emit
import openai
from bson import ObjectId
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Add supports_credentials=True



socketio = SocketIO(app, cors_allowed_origins='*')
app.secret_key = os.getenv("SECRETKEY")

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
database_name = os.getenv("DATABASE_NAME")
openai.api_key = os.getenv("OPENAPI_KEY")

client = MongoClient(MONGO_URL)
db = client[database_name]

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or auth_header != 'Bearer Admin-power':
            return jsonify({"message": "Admin login required"}), 401
        return f(*args, **kwargs)

    return decorated_function




@app.route('/')
def home():
    return 'Hello, Flask!'

conversation_history = [
    "Your role is to act as a FastFood Restaurant Chatbot Your name is TastyBite Bot.\n\nHere are some important details about our restaurant:",
    "Prompt 1: Hi there! I'm the FastFood Restaurant Chatbot. I'm here to assist you with any questions you have about our restaurant.",
    "Prompt 2: Feel free to ask me about our menu, special offers, opening hours, or anything else related to the restaurant.",
    "Prompt 3: If you're looking for some delicious burgers, pizzas, or fries, you've come to the right place!",
    "Prompt 4: Our restaurant is located at 121/3 Opera House, Delhi. Come visit us and treat yourself to some mouthwatering fast food.",
    "Prompt 5: We offer a variety of options for vegetarians and non-vegetarians alike. You'll definitely find something you love.",
    "Prompt 6: Our opening hours are from 10:00 AM to 10:00 PM, seven days a week. We're always ready to serve you.",
    "Prompt 7: If you want to know about our daily specials or discounts, just ask me! We have amazing deals every day.",
    "Prompt 8: Don't forget to try our signature dishes – they are the pride of our restaurant.",
    "Prompt 9: If you have any feedback or suggestions, we'd love to hear from you. Your satisfaction is our priority.",
    "Prompt 10: If you're not sure what to order, let me know your preferences, and I'll recommend something delicious for you.",
    "Prompt 11: For any urgent inquiries or assistance, you can also call our restaurant directly at +91 (062) 109-2022.",
    "Prompt 12: If you want to place an order for pickup or delivery, we have a quick and convenient online ordering system.",
    "Prompt 13: Remember, I'm here to help you, so don't hesitate to ask any questions or seek recommendations.",
    "Prompt 14: If you need to know about allergens or ingredients in a particular dish, I can provide that information as well.",
    "Prompt 15: I'm continuously learning and improving, so feel free to interact with me and make your experience better.",
    "Prompt 16: If you ever need to end the conversation, simply say 'Goodbye,' and I'll be happy to help you again later.",
    "Prompt 17: Let's get started! What can I assist you with today?"
]



@app.route('/chatbot', methods=['POST'])
def chatbot_interaction():
    user_message = request.json['message']

    # Append the user message to the conversation history
    conversation_history.append(user_message)

    # Generate chatbot response based on conversation history
    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt='\n'.join(conversation_history),
        max_tokens=100
    )
    chatbot_response = response.choices[0].text.strip()

    # Append the chatbot response to the conversation history
    conversation_history.append(chatbot_response)

    return jsonify({'message': chatbot_response})

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
   
    # Validate admin credentials (e.g., check against a database)
    if username == 'admin' and password == 'admin':
        # Set session to indicate admin authentication
        session['admin_authenticated'] = True
        return jsonify({"token": "Admin-power", "loggedIn": True})

    # Invalid credentials, show error message
    return jsonify({"message": "Invalid Credentials"}), 401  # 401 for unauthorized


@app.route('/admin/logout', methods=['GET'])
def admin_logout():
    # Remove the admin_authenticated session on logout
    session.pop('admin_authenticated', None)
    return jsonify({"message": "Logged out successfully"})


@app.route('/admin/is_admin', methods=['GET'])
def is_admin():
    # Check if the user is authenticated as an admin
    is_authenticated = session.get('admin_authenticated', False)
    return jsonify({"is_admin": is_authenticated})


@app.route('/menu', methods=['GET'])
def get_menu():
    menu = list(db.menu.find({}, {'_id': True, 'dish_name': True, 'price': True, 'availability': True, 'image': True}))
    menu_with_id = []
    for item in menu:
        item['_id'] = str(item['_id'])
        menu_item = {
            '_id': item['_id'],
            'dish_name': item['dish_name'],
            'price': item['price'],
            'availability': item['availability'],
        }
        if 'image' in item:
            menu_item['image'] = item['image']
        menu_with_id.append(menu_item)
    return jsonify(menu_with_id)

   

@app.route('/menu', methods=['POST'])
@login_required
def add_dish():
    dish_data = request.get_json()
    db.menu.insert_one(dish_data)
    return jsonify(message='Dish added successfully')



@app.route('/menu/<dish_id>', methods=['PUT'])
@login_required
def update_dish(dish_id):
   
    dish_data = request.get_json()
    db.menu.update_one({'_id': ObjectId(dish_id)}, {'$set': dish_data})
    return jsonify(message='Dish updated successfully')


@app.route('/menu/<dish_id>', methods=['DELETE'])
@login_required
def delete_dish(dish_id):
    
    db.menu.delete_one({'_id': ObjectId(dish_id)})
    return jsonify(message='Dish deleted successfully')


@app.route('/orders', methods=['POST'])
def take_order():
    order_data = request.get_json()
    order_data['status'] = 'received'
    db.orders.insert_one(order_data)
    return jsonify(message='Order taken successfully')


@socketio.on('update_status')

def update_order_status(data):
    order_id = data['order_id']
    new_status = data['new_status']
    db.orders.update_one({'_id': ObjectId(order_id)}, {
                         '$set': {'status': new_status}})
    emit('order_status_updated', {
         'order_id': order_id, 'new_status': new_status}, broadcast=True)

@app.route('/orders/<order_id>', methods=['PUT'])

def update_order(order_id):
    order_data = request.get_json()
    new_status = order_data.get('status')
    
    if new_status:
        db.orders.update_one({'_id': ObjectId(order_id)}, {'$set': {'status': new_status}})
        return jsonify(message='Order status updated successfully')
    else:
        return jsonify(error='Invalid request data'), 400


@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find(
        {}, {'_id': True, 'customerName': True, 'status': True, "Dishes": True}))
    orders_with_id = []
    for item in orders:
        order = {
            '_id': str(item.get('_id')),
            'customerName': item.get('customerName', ''),
            'status': item.get('status', ''),
            'Dishes': item.get('Dishes', [])
        }
        orders_with_id.append(order)
    return jsonify(orders_with_id)



@app.route('/dishes', methods=['POST'])
def get_dishes():
    dish_ids = request.json['dishIds']
    dish_object_ids = [ObjectId(dish_id) for dish_id in dish_ids]

    dishes = list(db.menu.find({'_id': {'$in': dish_object_ids}}, {
                  '_id': True, 'dish_name': True, 'price': True,}))
    dishes_with_id = []
    total_price = 0  # Initialize the total price

    for dish in dishes:
        dish['_id'] = str(dish['_id'])
        dishes_with_id.append({
            '_id': dish['_id'],
            'dish_name': dish['dish_name'],
            'price': dish['price']
        })
        total_price += dish['price']  # Add the dish price to the total price

    response = {
        'dishes': dishes_with_id,
        'total_price': total_price
    }

    
    return jsonify(response)

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    feedback_data = request.json
    db.feedback.insert_one(feedback_data)
    return jsonify({'message': 'Feedback submitted successfully'})


if __name__ == "__main__":
   
    socketio.run(app, debug=True, use_reloader=True)
