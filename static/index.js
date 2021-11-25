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
window.addEventListener("scroll", function () {

    var nav = document.querySelector(".nav");
    nav.classList.toggle("active", window.scrollY > 0);
})


function myFunction() {

    $.get('/random', function (response) {
        var random = response;
        get_backdrop(random);
        get_info(random);
    })

}

function get_info(id) {
    const info_url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_KEY
    $.get(info_url, function (data) {
        var info = data['title']
        var desc = data['overview']
        var name = document.getElementById('name');
        var description = document.getElementById('description');
        name.innerHTML = info;
        description.innerHTML = desc
    })
}

function get_backdrop(id) {
    const trailer_url = 'https://api.themoviedb.org/3/movie/' + id + '/images?api_key=' + API_KEY
    $.get(trailer_url, function (data) {
        var trailer_id = data['backdrops'][0]['file_path']
        show_backdrop(trailer_id);
    })

}

function show_backdrop(trailer_id) {
    var showcase = document.getElementsByClassName('showcase');
    showcase[0].style.backgroundImage = 'url(https://image.tmdb.org/t/p/original' + trailer_id + ')'
}


$.get('/movie_list', function (data) {
    $.each(data, function (i, item) {
        var genre_names = genre[i]['name']
        const movie_list = document.getElementById('movies_list')
        const row = document.createElement('div')
        row.className = 'row';
        row.classList.add("netflixrow");
        movie_list.appendChild(row);
        const genre_name = document.createElement('h2');
        genre_name.className = 'row_title';
        genre_name.innerText = 'Movies in ' + genre_names;
        movie_list.appendChild(genre_name);
        const movie_posters = document.createElement('div');
        movie_posters.className = 'row_posters';
        row.appendChild(movie_posters);
        movie_list.appendChild(movie_posters);
        movie_id = item[genre_names]
        $.each(movie_id, function (i, item) {
            const genre_url = 'https://api.themoviedb.org/3/movie/' + item + '/images?api_key=' + API_KEY;
            $.get(genre_url, function (data) {
                for (let i = 0; i < 15; i++) {
                    if (data['posters'][i]['iso_639_1'] == 'en') {
                        path = data['posters'][i]['file_path']
                        const img = document.createElement('img');
                        img.className = 'row_poster';
                        img.id = item;
                        img.src = 'https://image.tmdb.org/t/p/w185' + path;
                        img.onclick = function(){
                            sessionStorage.setItem("id", this.id)
                            window.location.href = '/movie';
                        }
                        movie_posters.appendChild(img);
                        break;
                    }
                }

            })

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