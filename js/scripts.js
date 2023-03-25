let movieRepository = (function () {
    let movieList = [];
    let apiUrl = 'https://imdb-api.com/en/API/MostPopularMovies/k_vfofrs3q';

    function addv(movie) {
        return (typeof movie === "object" && 'id' in movie && 'title' in movie);
    }

    function add(movie) {
        if (addv(movie)) {
            movieList.push(movie);
        } else {
            document.write("Input is not a valid object!");
        }
    }

    function getAll() {
        return movieList;
    }

    function showDetails(movie) {
        loadDetails(movie).then(function () {
//            console.log(movie);
            modalRepository.showModal(movie);
        });
    }

    function addListener (button, movie) {
        button.addEventListener('click', function () {
            showDetails(movie);
        }); 
    }

    function addListItem(movie) {
        let ulList = document.querySelector('.movie-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        listItem.classList.add('list-group-item');
        button.innerText = movie.title;
        button.classList.add('liButton', 'btn', 'btn-primary');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#modal-container');
        listItem.appendChild(button);
        ulList.appendChild(listItem);

        addListener(button, movie);
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function(json) {
 //           console.log(movieList);
//            let jsonArray = JSON.stringify(json);
            json.items.forEach(function (item) {
                let movie = {
                    id: item.id,
                    title: item.title,
                    imageUrl: item.image,
                    year: item.year,
                    rank: item.rank
                };
                add(movie);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
//  Ned to pass in ID and add to the end of the API call
        let url = `https://imdb-api.com/en/API/Ratings/k_vfofrs3q/${item.id}`;
        return fetch(url).then(function(response) {
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imDb = details.imDb;
            item.metacritic = details.metacritic;
            item.theMovieDb = details.theMovieDb;
            item.rottenTomatoes = details.rottenTomatoes;
        }).catch(function (e) {
            console.error(e);
        });
    }

    return {
        add,
        getAll,
        addListItem,
        loadList,
        loadDetails
    };
})();

let modalRepository = (function () {
    let modalContainer = document.querySelector('#modal-container');
    const $ = window.$; // Function to display the modal with movie data

    function showModal(movie) {
//        console.log(movie);
        let modalBody = $('.modal-body')
        let modalTitle = $('.modal-title');

        // Clear existing content of the modal
        modalTitle.empty();
        modalBody.empty();

        // Creating element for title in modal content
        let movieTitle = $("<h1>" + movie.title + "</h1>");
        // Creating element for year in modal content
        let movieYear = $("<p>" + "Year : " + movie.year + "</p>");
        // Creating element for rank in modal content
        let movieRank = $("<p>" + "Rank : " + movie.rank + "</p>");
        // Creating img in modal content
         let imageElement = $('<img class="modal-img" style="width:50%">');
        imageElement.attr("src", movie.imageUrl);
        // Creating element for imDb Rating in modal content
        let imDbElement = $("<p>" + "imDb Rating : " + movie.imDb + "</p>");
        // Creating element for weight in modal content
        let metacriticElement = $("<p>" + "Metacritic Rating : " + movie.metacritic + "</p>");
        // Creating element for theMovieDb Rating in modal content
        let theMovieDbElement = $("<p>" + "theMovieDb Rating : " + movie.theMovieDb + "</p>");
        // Creating element for rottenTomatoes in modal content
        let rottenTomatoesElement = $("<p>" + "RottenTomatoes : " + movie.rottenTomatoes + "</p>");

        modalTitle.append(movieTitle);
        modalBody.append(movieYear);
        modalBody.append(movieRank);
        modalBody.append(imageElement);
        modalBody.append(imDbElement);
        modalBody.append(metacriticElement);
        modalBody.append(theMovieDbElement);
        modalBody.append(rottenTomatoesElement);
    }

    function hideModal() {
        $('.modal-title').empty();
        $('.modal-body').empty();
        $('.modal-footer').empty();
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    return {
        showModal,
        hideModal
    };
})();

movieRepository.loadList().then(function() {
    // Now the data is loaded!
    movieRepository.getAll().forEach(function(movie) {
        movieRepository.addListItem(movie);
    });
});
