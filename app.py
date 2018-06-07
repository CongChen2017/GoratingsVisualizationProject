
# Import necessary libraries
from flask import Flask, render_template,request,redirect,url_for, jsonify # For flask implementation
from pymongo import MongoClient # Database connector
from bson.objectid import ObjectId # For ObjectId to work
import pandas as pd
from collections import Counter

#################################################
# Database Setup
#################################################
DB_Name = "goplayers_db"
DB_HOST = "ds241570.mlab.com"
DB_PORT = 41570
DB_USER = "thisiscc"
DB_PASS = "tomcat1234"
client = MongoClient(DB_HOST, DB_PORT)    #Configure the connection to the database
db = client[DB_Name]
db.authenticate(DB_USER, DB_PASS)    #Select the database
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

@app.route("/team")
def teampage():
    return render_template("team.html")

# "names" route
#   List of player names.

@app.route('/names')
def names():
    # Query metadata of the 'samples' table 
    names = players.find({}, {"_id":0,"Name":1,"Rank":1})
    name_list = [(name['Name'], name['Rank']) for name in names]
    players_list = []
    for name in name_list:
        players_list.append({"Name": name[0], "Rank": name[1]})
    sorted_list = sorted(players_list, key=lambda player: int(player['Rank']))
    # Return jsonified results
    return jsonify(sorted_list)

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

@app.route('/Top20')
def Top20():

    final_list = PullDataforComparisonChart(20)
    
    return jsonify(final_list)

@app.route('/Top50')
def Top50():

    final_list = PullDataforComparisonChart(50)
    
    return jsonify(final_list)

@app.route('/teamfight/<num>')
def teamfight(num):

    final_results = team_fight_results(num)
    
    return jsonify(final_results)
    
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

# define a function to investigate team fight results
def team_fight_results(Num):
    
    # handle cn players information first
    all_cn_players=[]
    all_cn_players.append(list(players.find({"Nation": "cn"}, {"_id":0, "Rank":1, "Name":1, "Games":1})))
    sorted_cn_players = sorted(all_cn_players[0], key=lambda player: int(player['Rank']))
    cn_players = sorted_cn_players[0:int(Num)]
    cn_players_name = []
    cn_players_rank = []
    for i in range(len(cn_players)):
        cn_players_name.append(cn_players[i]["Name"])
        cn_players_rank.append(cn_players[i]["Rank"])
    
    # handle kr players
    all_kr_players=[]
    all_kr_players.append(list(players.find({"Nation": "kr"}, {"_id":0, "Rank":1, "Name":1, "Games":1})))
    sorted_kr_players = sorted(all_kr_players[0], key=lambda player: int(player['Rank']))
    kr_players = sorted_kr_players[0:int(Num)]
    kr_players_name = []
    kr_players_rank = []
    for i in range(len(kr_players)):
        kr_players_name.append(kr_players[i]["Name"])
        kr_players_rank.append(kr_players[i]["Rank"])
        
    # get historical records
    final_record = []
    for j in range(int(Num)):
        game_index = []
        game_count =0
        for i in range(len(cn_players[j]['Games']['Opponent'])):
            if cn_players[j]['Games']['Opponent'][i] == kr_players_name[j]:
                game_index.append(i)
                game_count +=1
        game_results = []
        for index in game_index:
            game_results.append(cn_players[j]['Games']['Result'][index])
        record = Counter(game_results)
        record = dict(record)

        if len(record) > 1: 
            if record['Win'] > record['Loss']:
                result = 'Win'
            elif record['Win'] < record['Loss']:
                result = 'Loss'
            else:
                result = 'Draw'
            record['Result'] = result
        elif len(record) == 1:
            record['Result'] = list(record.keys())[0]
            if record['Result'] == 'Win':
                record['Loss'] = 0
            else:
                record['Win'] = 0
        else:
            record['Result'] = 'Draw'
            record['Win'] = 0
            record['Loss'] =0
        record['Count'] = game_count
        record['cn_name'] = cn_players_name[j]
        record['cn_rank'] = cn_players_rank[j]
        record['kr_name'] = kr_players_name[j]
        record['kr_rank'] = kr_players_rank[j]
        final_record.append(record)
    
    # return record as a list
    return final_record

# Script execution
if __name__ == "__main__":
    app.run(debug=True)
