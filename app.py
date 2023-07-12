from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO, emit
import openai

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app)

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
database_name = os.getenv("DATABASE_NAME")
openai.api_key = os.getenv("OPENAPI_KEY")

client = MongoClient(MONGO_URL)
db = client[database_name]

@app.route('/')
def home():
    return 'Hello, Flask!'

@app.route('/chatbot', methods=['POST'])
def chatbot_interaction():
    user_message = request.json['message']

    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=user_message,
        max_tokens=100
    )
    chatbot_response = response.choices[0].text.strip()

    return jsonify({'message': chatbot_response})

@app.route('/menu', methods=['GET'])
def get_menu():
    menu = list(db.menu.find({}, {'_id': True, 'dish_name': True, 'price': True, 'availability': True}))
    menu_with_id = []
    for item in menu:
        item['_id'] = str(item['_id'])
        menu_with_id.append({
            'id': item['_id'],
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
    db.orders.insert_one(order_data)
    return jsonify(message='Order taken successfully')


@socketio.on('update_status')
def update_order_status(data):
    order_id = data['order_id']
    new_status = data['new_status']
    db.orders.update_one({'_id': order_id}, {'$set': {'status': new_status}})
    emit('order_status_updated', {'order_id': order_id, 'new_status': new_status}, broadcast=True)


@app.route('/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    order_data = request.get_json()
    db.orders.update_one({'_id': order_id}, {'$set': order_data})
    return jsonify(message='Order status updated successfully')


@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find({}, {'_id': False}))
    return jsonify(orders)


@app.route('/feedback', methods=['POST'])
def submit_feedback():
    feedback_data = request.json
    db.feedback.insert_one(feedback_data)
    return jsonify({'message': 'Feedback submitted successfully'})


if __name__ == "__main__":
    socketio.run(app, debug=True)
