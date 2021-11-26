import pickle
from flask import Flask ,render_template, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
import random ,os

app = Flask(__name__,instance_relative_config=False)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1 ,x_proto=1)
app.secret_key = os.urandom(24)
genre = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

def recommend(movie):
    similarity = pickle.load(open('similarity.sav','rb'))
    new_df = pickle.load(open('data.sav','rb'))
    movie_index = new_df[new_df['id'] == int(movie)].index[0]
    movie_list = sorted(list(enumerate(similarity[movie_index])),reverse=True,key= lambda x:x[1])[1:19]
    rec_movies = []
    for i in movie_list:
        rec_movies.append(str(new_df.iloc[i[0]][0]))
    return {'ids':rec_movies}


@app.route('/')
@app.route('/recommend',methods=['GET','POST'])
def index():        
    return render_template('base.html',)

@app.route('/random')
def random_movie():
    new_df = pickle.load(open('data.sav','rb'))
    random_id = new_df.iloc[random.randint(0,9303)][0]
    return str(random_id)

@app.route('/movie_list')
def movie_list():
    rec_df = pickle.load(open('movie_data.sav','rb'))
    movie_list = []
    for i in genre:
        movie_list.append({ 
            i['name'] :rec_df[rec_df['genres'] == i['name']].iloc[0:25]['id'].to_list()
        })
    return jsonify(movie_list)    

    
@app.route('/id=<id>',methods=['GET','POST'])
def return_movie(id):
    if request.method == 'GET':
        return recommend(id)

@app.route('/list',methods=['GET','POST'])
def return_list():
    new_df = pickle.load(open('data.sav','rb'))
    if request.method == 'GET':
        return jsonify(new_df['title'].to_list())
    if request.method == 'POST':
        movie = request.get_json('name')
        movie_id = str(new_df[new_df['title'] == movie['name']].iloc[0][0]) 
        return movie_id

@app.route('/movie')
def movie_info():
    return render_template('movie_page.html')       



if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)