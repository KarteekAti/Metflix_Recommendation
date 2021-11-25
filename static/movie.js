const API_KEY = '096ee5c74001b6b7949f954b123e936a';
const genre = [{
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
const id = sessionStorage.getItem("id");
$('.nav_logo').on('click', function(e) {
    window.location.href = './'
})

const movie_url ='https://api.themoviedb.org/3/movie/'+id+'?api_key='+API_KEY
const cast_url = 'https://api.themoviedb.org/3/movie/'+id+'/credits?api_key='+API_KEY
window.addEventListener("scroll", function () {

    var nav = document.querySelector(".nav");
    nav.classList.toggle("active", window.scrollY > 0);
})


var url = '/id='+id;
function myFunction() {
    $.get(movie_url,function(data) {
    var showcase = document.getElementsByClassName('showcase');
    var name = document.getElementById('name');
    var description = document.getElementById('description');
    name.innerHTML = data['original_title'];
    description.innerHTML = data['overview'];
    path = data['backdrop_path']
    showcase[0].style.backgroundImage = 'url(https://image.tmdb.org/t/p/original' + path + ')'
    })

}

$.get(cast_url, function (data){
    const movie_list = document.getElementById('movie-info');
    const row = document.createElement('div');
    row.className = 'row1'
    const header = document.createElement('h2')
    header.innerHTML = 'CAST'
    movie_list.appendChild(header)
    var cast = data['cast'].slice(0,9)
    $.each(cast,function(i, item){
        var cast_name = item['name']
        var cast_id = item['id']
        var cast = document.createElement('div')
        cast.className = 'cast-name'
        const name = document.createElement('h3')
        name.className = 'cast_name'
        name.innerHTML = cast_name
        cast.appendChild(name)
        const cast_details = 'https://api.themoviedb.org/3/person/'+cast_id+'/images?api_key='+API_KEY
        $.get(cast_details, function(data){
           var pic = data['profiles'][0]['file_path']
           const cast_img = document.createElement('div')
           cast_img.className = 'cast_img'
           const img = document.createElement('img');
           img.className = 'cast_poster';
           img.id = cast_id;
           img.src = 'https://image.tmdb.org/t/p/w154' + pic
           cast_img.appendChild(img)
           row.appendChild(cast_img);
           row.appendChild(cast);
           
        })
    })
    movie_list.appendChild(row)
})

$.get(url, function (data) {
    const movie_list = document.getElementById('movie');
    const row = document.createElement('div');
    row.className = 'row';
    row.classList.add("netflixrow");
    movie_list.appendChild(row);
    const recommended = document.createElement('h2');
    recommended.className = 'row_title';
    recommended.innerText = 'MORE LIKE THIS'
    movie_list.appendChild(recommended);
    const movie_posters = document.createElement('div');
    movie_posters.className = 'row_posters';
    row.appendChild(movie_posters);
    movie_list.appendChild(movie_posters);
    $.each(data['ids'], function(i,item){
        var movie_url ='https://api.themoviedb.org/3/movie/'+item+'?api_key='+API_KEY;
        $.get(movie_url, function (data){
            var path = data['poster_path']
            const img = document.createElement('img');
            img.className = 'row_poster';
            img.id = data['id'];
            img.src = 'https://image.tmdb.org/t/p/w185' + path;
            img.onclick = function(){
                sessionStorage.setItem("id", this.id)
                window.location.href = '/movie';
            }
            movie_posters.appendChild(img);
        })
    })
})


$('#tags').keydown(function(event){
    var input = document.getElementById('tags')
    if ((event.keyCode || event.which) === 13){
        $.post('/list',JSON.stringify({
            'name':input.value
        }),
        function(data){
            sessionStorage.setItem('id',data)
            window.location.href = '/movie';
        })
    }
})

$( function() {
    $.get('/list', function(data){
        $( "#tags" ).autocomplete({
            source: data,  
            minLength:4
          });
    })
})