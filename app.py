
# Import necessary libraries
from flask import Flask, render_template,request,redirect,url_for, jsonify # For flask implementation
from pymongo import MongoClient # Database connector
from bson.objectid import ObjectId # For ObjectId to work

#################################################
# Database Setup
#################################################
client = MongoClient('localhost', 27017)    #Configure the connection to the database
db = client.GOplayers_db    #Select the database
players = db.players   #Select the collection

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Home route
#   Route renders index.html template.
@app.route("/")
def home():
    return render_template("index.html")

# "names" route
#   List of player names.

@app.route('/names')
def names():
    # Query metadata of the 'samples' table 
    names = players.find({}, {"_id":0,"Rank":1})
    name_list = [name['Rank'] for name in names]

    # Return jsonified results
    return jsonify(name_list)

@app.route('/players/<rank>')
def player(rank):
    # Query metadata of the 'samples' table 
    park = players.find({"Rank":rank}, {"_id":0})
    park_info = [info for info in park]

    # Return jsonified results
    return jsonify(park_info[0])


# Script execution
if __name__ == "__main__":
    app.run(debug=True)
