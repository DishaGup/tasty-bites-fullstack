from flask import Flask, jsonify, request
import unittest
from flask_testing import TestCase

from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO, emit
import openai
from bson import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")

socketio = SocketIO(app, cors_allowed_origins='*')


load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
database_name = os.getenv("DATABASE_NAME")
openai.api_key = os.getenv("OPENAPI_KEY")

client = MongoClient(MONGO_URL)
db = client[database_name]


@app.route('/')
def home():
    return 'Hello, Flask!'


conversation_history = []
conversation_history.append(
    "Hi there! I'm Tasty Bites' chatbot. I'm here to assist you with any questions you have.")
conversation_history.append(
    "If you have any queries, feel free to ask. I'll do my best to provide helpful and entertaining responses.")
conversation_history.append(
    "If you're wondering about Tasty Bites' location, we are situated at 9/97 Opera House, Delhi.")
conversation_history.append(
    "At Tasty Bites, we offer a wide range of delicious dishes, including vegetarian and Chinese cuisine.")
conversation_history.append(
    "Our opening hours are from 9:00 AM to 10:00 PM. We're here to serve you throughout the day.")


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


@app.route('/menu', methods=['GET'])
def get_menu():
    menu = list(db.menu.find({}, {'_id': True, 'dish_name': True,
                'price': True, 'availability': True}))
    menu_with_id = []
    for item in menu:
        item['_id'] = str(item['_id'])
        menu_with_id.append({
            '_id': item['_id'],
            'dish_name': item['dish_name'],
            'price': item['price'],
            'availability': item['availability']
        })
    return jsonify(menu_with_id)


@app.route('/menu', methods=['POST'])
def add_dish():
    dish_data = request.get_json()
    db.menu.insert_one(dish_data)
    return jsonify(message='Dish added successfully')


@app.route('/menu/<dish_id>', methods=['PUT'])
def update_dish(dish_id):
    dish_data = request.get_json()
    db.menu.update_one({'_id': dish_id}, {'$set': dish_data})
    return jsonify(message='Dish updated successfully')


@app.route('/menu/<dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    db.menu.delete_one({'_id': dish_id})
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
    db.orders.update_one({'_id': ObjectId(order_id)}, {'$set': order_data})
    return jsonify(message='Order status updated successfully')


@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find(
        {}, {'_id': True, 'customerName': True, 'status': True, "Dishes": True}))
    orders_with_id = []
    for item in orders:
        item['_id'] = str(item['_id'])
        orders_with_id.append({
            '_id': item['_id'],
            'customerName': item['customerName'],
            'status': item['status'],
            "Dishes": item["Dishes"]
        })
    return jsonify(orders_with_id)


@app.route('/dishes', methods=['POST'])
def get_dishes():
    dish_ids = request.json['dishIds']
    dish_object_ids = [ObjectId(dish_id) for dish_id in dish_ids]

    dishes = list(db.menu.find({'_id': {'$in': dish_object_ids}}, {
                  '_id': True, 'dish_name': True, 'price': True}))
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

    print(response)
    return jsonify(response)


@app.route('/feedback', methods=['POST'])
def submit_feedback():
    feedback_data = request.json
    db.feedback.insert_one(feedback_data)
    return jsonify({'message': 'Feedback submitted successfully'})


if __name__ == "__main__":
   
    socketio.run(app, debug=True, use_reloader=True)
