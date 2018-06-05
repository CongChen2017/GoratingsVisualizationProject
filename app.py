
# Import necessary libraries
from flask import Flask, render_template,request,redirect,url_for, jsonify # For flask implementation
from pymongo import MongoClient # Database connector
from bson.objectid import ObjectId # For ObjectId to work
import pandas as pd

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

@app.route("/player")
def playerpage():
    return render_template("player.html")
# "names" route
#   List of player names.

@app.route('/names')
def names():
    # Query metadata of the 'samples' table 
    names = players.find({}, {"_id":0,"Name":1,"Rank":1})
    name_list = [(name['Name'], name['Rank']) for name in names]
    players_list = []
    for name in name_list:
        players_list.append({"name": name[0], "rank": name[1]})
    # Return jsonified results
    return jsonify(players_list)

@app.route('/players/<rank>')
def player(rank):
    # Query metadata of the 'samples' table 
    park = players.find({"Rank":rank}, {"_id":0})
    park_info = [info for info in park]

    # Return jsonified results
    return jsonify(park_info[0])

@app.route('/Top10')
def Top10():

    final_list = PullDataforComparisonChart(10)
    
    return jsonify(final_list)
    
def PullDataforComparisonChart(rank):
    lst = []
    for i in range(1 , rank+1):
        lst.append(list(players.find({"Rank": str(i)})))

    for dictt in lst[0]:
            del dictt["_id"]
    dict_list = {
        "Birthday": [lst[i][0]['Birthday'] for i in range(len(lst))],
        'Link': [lst[i][0]['Link'] for i in range(len(lst))],
        'Name': [lst[i][0]['Name'] for i in range(len(lst))],
        'Gender': [lst[i][0]['Gender'] for i in range(len(lst))],
        'Nation': [lst[i][0]['Nation'] for i in range(len(lst))],
        'Elo': [lst[i][0]['Elo'] for i in range(len(lst))],
        'Rank': [lst[i][0]['Rank'] for i in range(len(lst))],
        'Wins': [lst[i][0]['Wins'] for i in range(len(lst))],
        'Losses': [lst[i][0]['Losses'] for i in range(len(lst))],
        'Total': [lst[i][0]['Total'] for i in range(len(lst))],
        'Games': [lst[i][0]['Games'] for i in range(len(lst))]
    }
    
    Games = dict_list['Games']
    del dict_list['Games']
    
    def dictTranform(dict_list):
        df = pd.DataFrame(dict_list)
        names = list(df.columns)
        Outerlst = []
        for i in range(len(df)):
            innerList = []
            for j in range(len(names)):
                innerList.append(df.loc[i, names[j]])
            Outerlst.append(dict(zip(names, innerList)))
        return Outerlst
    games_list = []
    for num in range(len(Games)):
        games_list.append(dictTranform(Games[num]))
        
    final_list = dictTranform(dict_list)

    for index in range(len(final_list)):
        final_list[index]['Games'] = games_list[index]


    return final_list


# Script execution
if __name__ == "__main__":
    app.run(debug=True)
