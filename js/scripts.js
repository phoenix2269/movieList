let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function addv(pokemon) {
        return (typeof pokemon === "object" && 'name' in pokemon && 'detailsUrl' in pokemon);
    }

    function add(pokemon) {
        if (addv(pokemon)) {
            pokemonList.push(pokemon);
        } else {
            document.write("Input is not a valid object!");
        }
    }

    function getAll() {
        return pokemonList;
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
//            console.log(pokemon);
            modalRepository.showModal(pokemon);
        });
    }

    function addListener (button, pokemon) {
        button.addEventListener('click', function () {
            showDetails(pokemon);
        }); 
    }

    function addListItem(pokemon) {
        let ulList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        listItem.classList.add('list-group-item');
        button.innerText = pokemon.name;
        button.classList.add('liButton', 'btn', 'btn-primary');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#modal-container');
        listItem.appendChild(button);
        ulList.appendChild(listItem);

        addListener(button, pokemon);
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function(json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function(response) {
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = details.types;
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
    const $ = window.$; // Function to display the modal with Pokemon data

    function showModal(pokemon) {
//        console.log(pokemon);
        let modalBody = $('.modal-body')
        let modalTitle = $('.modal-title');

        // Clear existing content of the modal
        modalTitle.empty();
        modalBody.empty();

        // Creating element for name in modal content
        let pokemonName = $("<h1>" + pokemon.name + "</h1>");
        // Creating img in modal content
         let imageElement = $('<img class="modal-img" style="width:50%">');
        imageElement.attr("src", pokemon.imageUrl);
        // Creating element for height in modal content
        let heightElement = $("<p>" + "height : " + pokemon.height + "</p>");
        // Creating element for weight in modal content
        let weightElement = $("<p>" + "weight : " + pokemon.weight + "</p>");
        // Creating element for type in modal content
    //    let typesElement = $("<p>" + "types : " + pokemon.types + "</p>");
        // Creating element for abilities in modal content
    //    let abilitiesElement = $("<p>" + "abilities : " + pokemon.abilities + "</p>");

        modalTitle.append(pokemonName);
        modalBody.append(imageElement);
        modalBody.append(heightElement);
        modalBody.append(weightElement);
    //    modalBody.append(typesElement);
    //    modalBody.append(abilitiesElement);
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

pokemonRepository.loadList().then(function() {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
