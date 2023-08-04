from flask import Flask, jsonify, request, session
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO, emit
import openai
from bson import ObjectId
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow cross-origin requests

socketio = SocketIO(app, cors_allowed_origins='*')
app.secret_key = os.getenv("SECRETKEY")

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
database_name = os.getenv("DATABASE_NAME")
openai.api_key = os.getenv("OPENAPI_KEY")

client = MongoClient(MONGO_URL)
db = client[database_name]


# Custom decorator to require admin login for specific routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or auth_header != 'Bearer Admin-power':
            return jsonify({"message": "Admin login required"}), 401
        return f(*args, **kwargs)

    return decorated_function


# Home route
@app.route('/')
def home():
    return 'Hello, Flask!'


# Conversation history for the chatbot
conversation_history = [
    # Initial chatbot introduction prompts
    "Your role is to act as a FastFood Restaurant Chatbot. Your name is TastyBite Bot.",
    "Prompt 1: Hi there! I'm the FastFood Restaurant Chatbot. I'm here to assist you with any questions you have about our restaurant.",
    "Prompt 2: Feel free to ask me about our menu, special offers, opening hours, or anything else related to the restaurant.",
   
]


# Route for chatbot interaction
@app.route('/chatbot', methods=['POST'])
def chatbot_interaction():
    user_message = request.json['message']

    # Append the user message to the conversation history
    conversation_history.append(user_message)

    # Generate chatbot response based on conversation history
    response =  openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
         {"role": "system", "content": "You are a helpful assistant."},
         {"role": "user", "content": "Hello!"}
     ],
        prompt='\n'.join(conversation_history),
        max_tokens=20,
        temperature=0,
    )
    print(response)
    chatbot_response = response.choices[0].text.strip()
    print(chatbot_response)

    # Append the chatbot response to the conversation history
    conversation_history.append(chatbot_response)

    return jsonify({'message': chatbot_response})


# Admin login route
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
    return jsonify({"message": "Invalid Credentials"}), 401


# Admin logout route
@app.route('/admin/logout', methods=['GET'])
def admin_logout():
    # Remove the admin_authenticated session on logout
    session.pop('admin_authenticated', None)
    return jsonify({"message": "Logged out successfully"})


# Check if the user is an admin
@app.route('/admin/is_admin', methods=['GET'])
def is_admin():
    # Check if the user is authenticated as an admin
    is_authenticated = session.get('admin_authenticated', False)
    return jsonify({"is_admin": is_authenticated})


# Get the menu
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

# Add a dish to the menu
@app.route('/menu', methods=['POST'])
@login_required
def add_dish():
    dish_data = request.get_json()
    db.menu.insert_one(dish_data)
    return jsonify(message='Dish added successfully')

# Update a dish in the menu
@app.route('/menu/<dish_id>', methods=['PUT'])
@login_required
def update_dish(dish_id):
    dish_data = request.get_json()
    db.menu.update_one({'_id': ObjectId(dish_id)}, {'$set': dish_data})
    return jsonify(message='Dish updated successfully')

# Delete a dish from the menu
@app.route('/menu/<dish_id>', methods=['DELETE'])
@login_required
def delete_dish(dish_id):
    db.menu.delete_one({'_id': ObjectId(dish_id)})
    return jsonify(message='Dish deleted successfully')

# Take a new order
@app.route('/orders', methods=['POST'])
def take_order():
    order_data = request.get_json()
    order_data['status'] = 'received'
    db.orders.insert_one(order_data)
    return jsonify(message='Order taken successfully')

# Update order status using SocketIO
@socketio.on('update_status')
def update_order_status(data):
    order_id = data['order_id']
    new_status = data['new_status']
    db.orders.update_one({'_id': ObjectId(order_id)}, {'$set': {'status': new_status}})
    emit('order_status_updated', {'order_id': order_id, 'new_status': new_status}, broadcast=True)

# Update order status
@app.route('/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    order_data = request.get_json()
    new_status = order_data.get('status')
    
    if new_status:
        db.orders.update_one({'_id': ObjectId(order_id)}, {'$set': {'status': new_status}})
        return jsonify(message='Order status updated successfully')
    else:
        return jsonify(error='Invalid request data'), 400

# Get all orders
@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find({}, {'_id': True, 'customerName': True, 'status': True, "Dishes": True}))
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

# Get dishes for a specific order
@app.route('/dishes', methods=['POST'])
def get_dishes():
    dish_ids = request.json['dishIds']
    dish_object_ids = [ObjectId(dish_id) for dish_id in dish_ids]

    dishes = list(db.menu.find({'_id': {'$in': dish_object_ids}}, {
                  '_id': True, 'dish_name': True, 'price': True,}))
    dishes_with_id = []
    total_price = 0

    for dish in dishes:
        dish['_id'] = str(dish['_id'])
        dishes_with_id.append({
            '_id': dish['_id'],
            'dish_name': dish['dish_name'],
            'price': dish['price']
        })
        total_price += dish['price']

    response = {
        'dishes': dishes_with_id,
        'total_price': total_price
    }

    return jsonify(response)

# Submit feedback
@app.route('/feedback', methods=['POST'])
def submit_feedback():
    feedback_data = request.json
    db.feedback.insert_one(feedback_data)
    return jsonify({'message': 'Feedback submitted successfully'})

# Run the application
if __name__ == "__main__":
   port = int(os.environ.get("PORT", 5000))
   socketio.run(app, debug=True, use_reloader=True, host='0.0.0.0', port=port)
