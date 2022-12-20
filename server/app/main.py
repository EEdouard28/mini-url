# Flask server ... Render the build on one application
from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admimn import db
import os

# Provides python app access to firebase database
cred_obj = firebase_admin.get_credentials.Certificate(
    './ServiceAccountKey.json')
# Allows access to the database
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL': 'https://mini-url-d15ac-default-rtdb.firebaseio.com/'
})
