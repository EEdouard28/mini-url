# Flask server ... Render the build on one application
from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials
import os


# Provides python app access to firebase database
cred_obj = credentials.Certificate('../ServiceAccountKey.json')
# Allows access to the database
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL': 'https://mini-url-d15ac-default-rtdb.firebaseio.com/'
})

# Initialize flask app
app = Flask(__name__, static_folder='./build/static',
            template_folder="./build")


@app.route("/")
def hello_world():
    return redirect("/app")


@app.route("/app")
def homepage():
    return render_template('index.html')

# Method which access to the database and redirects longURL


@app.route('/<path:generatedKey>', methods=['GET'])
def fetch_from_firebase(generatedKey):
    ref = db.reference("/" + generatedKey)
    data = ref.get()
    if not data:
        return '404 not found'
    else:
        longURL = data['longURL']
        return redirect(longURL)
