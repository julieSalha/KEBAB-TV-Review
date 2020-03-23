// DÉCLARATIONS

    // API Node Back-end Julien NOYER //Register/login/favori (API Node)
    const apiUrl = 'https://kebabtv.dwsapp.io';

    // API Front The Movie Data Base
    const theMoviedbURL = 'https://api.themoviedb.org/3/search/movie?api_key=6fd32a8aef5f85cabc50cbec6a47f92f&query=';


    const mainNav = document.querySelector('header nav');

    // Search form
    const searchForm = document.querySelector('#searchForm');
    const searchLabel = document.querySelector('#searchForm span');
    const searchData = document.querySelector('[name="searchData"]');

            // Register
    const registerForm = document.querySelector('#registerForm');
    const userEmail = document.querySelector('[name="userEmail"]');
    const userPassword = document.querySelector('[name="userPassword"]');
    const userPseudo = document.querySelector('[name="userPseudo"]');

        // Login 
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('[name="loginEmail"]');
    const loginPassword = document.querySelector('[name="loginPassword"]');

    // Movies & Bookmarks
    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article');
    const favoriteList = document.querySelector('#favorite ul');
    const buttonDelete = document.querySelector('#favorite ul button.eraseFavorite');

    // Loading
    const loading = document.querySelector('#loading');

    // Error
    const formError = document.querySelector('#formError');



// FONCTIONS

    /* Register */ 

const registerUser = () => {
        registerForm.addEventListener('submit', event => {
            // Stop event propagation
            event.preventDefault();

            new FETCHrequest(
                `${apiUrl}/api/register`,
                'POST',
                {
                    email : userEmail.value,
                    password : userPassword.value,
                    pseudo : userPseudo.value
                }
             )
        .sendRequest()
        .then( jsonData => {
            console.log(jsonData)
        })
        .catch( jsonError => {
            console.log(jsonError);
        })
      })
};

    /* Login */
    
const login = () => {
        loginForm.addEventListener('submit', event => {
            // Stop event propagation
            event.preventDefault();
    
        new FETCHrequest(
                `${apiUrl}/api/login`,
                'POST',
                {
                    email : userEmail.value,
                    password : userPassword.value
                }
             )
        .sendRequest()
        .then( jsonData => {
            console.log(jsonData)
            // Stocker le token utilisateur dans le Local Storage (incognito)
            localStorage.setItem('kento', jsonData.data.token);
    
        // Données utilisateurs
        userAccount();
        })
        .catch( jsonError => {
            console.log(jsonError);
        })
    });
};

    /* Compte utilisateur */


const userAccount = () => {
        new FETCHrequest(
            `${apiUrl}/api/me`,
            'POST',
            {
                token : localStorage.getItem('kento')
            }
         )
    .sendRequest()
    .then( jsonData => {
        // Masquer formulaire register + login
        registerForm.classList.add('hidden')
        loginForm.classList.add('hidden')
        console.log(jsonData)

    })
    .catch( jsonError => {
        console.log(jsonError);
    })
};

    /* Favoris utilisateurs */

    const checkUserToken = (step = 'favorite') => {
        new FETCHrequest(
            `${apiUrl}/api/me/${localStorage.getItem(localSt)}`,
            'GET'
        )
        .fetch()
        .then( fetchData => {
            // Check step
            if( step === 'favorite' ){ // Add favorite
                // Display favorites
                displayFavorite(fetchData.data.favorite)
            }
            else if( step === 'checkuser' ){ // First check
                console.log(fetchData)
                // Hide register and loggin form
                registerForm.classList.add('hidden');
                loginForm.classList.add('hidden');
                searchForm.classList.add('open');

                // Display nav
                displayNav(fetchData.data.user.pseudo);

                // Display favorites
                displayFavorite(fetchData.data.favorite)

                // Get form submit event
                getFormSumbit();
            }
        })
        .catch( fetchError => {
            console.log(fetchError)
        })
    }


    /* Search Movies */

const getSearchSubmit = () => {
      searchForm.addEventListener('submit', event => { 
        event.preventDefault();

        searchData.value.length > 3
        ? searchMovie(searchData.value) 
        : displayError(searchData, 'Minimum 3 caractères !');
      })
};


const displayError = (tag, msg) => {
      searchLabel.textContent = msg;
      tag.addEventListener('focus', () => searchLabel.textContent = '');
};

const searchMovie = (keywords, index = 1) => {

      let fetchUrl = null;

      typeof keywords === 'number'
      ? fetchUrl = `https://api.themoviedb.org/3/movie/${keywords}?api_key=6fd32a8aef5f85cabc50cbec6a47f92f`
      : fetchUrl = theMoviedbURL + keywords + '&page=' + index

      fetch( fetchUrl )
      .then( response => response.ok ? response.json() : 'Response not OK')
      .then( jsonData => {
        typeof keywords === 'number'
        ? displayPopin(jsonData)
        : displayMovieList(jsonData.results)
      })
      .catch(err => console.error(err));

    //   closeLoading();
};


    /* Display movies */

const displayMovieList = listMovies => {
      searchData.value = '';
      movieList.innerHTML = '';

      for (let i = 0; i < listMovies.length; i++){

        let cover = listMovies[i].poster_path !== null 
        ? 'https://image.tmdb.org/t/p/w500' + listMovies[i].poster_path 
        : './img/blankCover.jpg'

        movieList.innerHTML += `
        <article>
            <figure>
                <img src="${cover}" alt="${listMovies[i].original_title}">
                <figcaption movie-id="${listMovies[i].id}">${listMovies[i].original_title} (See more...)</figcaption>
            </figure>
        </article>
        `;
      };

      getPopinLink(document.querySelectorAll('figcaption'));
};

const getPopinLink = (linkCollection) => {
        for (let link of linkCollection){
          link.addEventListener('click', () => {
            //+var = parseInt(var) || parseFloat(var)
            searchMovie(+link.getAttribute('movie-id'));
          });
        };
};

const displayPopin = (data) => {
        console.log(data);
        moviePopin.innerHTML = `
          <div>
            <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.original_title}">
          </div>

          <div>
            <h2>${data.original_title}</h2>
            <p>${data.overview}</p>
            <button id="addFav">Add in Favorites</button>
            <button id="closeButton">Close</button>
          </div>
        `;

        moviePopin.parentElement.classList.add('open');
        addFavorite(document.querySelector('#addFav'), data);

        closePopin(document.querySelector('#closeButton'));
};

    /* Ajout + afficher des favoris */

const addFavorite = (button, data) => {
    button.addEventListener('click', () => {

        new FETCHrequest(
            `${apiUrl}/api/favorite`,
            'POST',
            {
                id : data.id,
                title : data.original_title,
                token : localStorage.getItem('kento')
            }
         )
        .sendRequest()
        .then( jsonData => console.log(jsonData))
        .catch( jsonError => console.log(jsonError));
    
        favoriteList.innerHTML += `
                <li>
                    <span>${data.original_title}</span>
                    <button class="eraseFavorite" movie-id="${data._id}"><i class="fas fa-eraser"></i></button>
                </li>
            `    
    })
};


/* Supprimer favoris */

const deleteFavorite = _id => {

    document.querySelectorAll('.eraseFavorite').addEventListener('click', () => {
        new FETCHrequest(
            `${apiUrl}/api/favorite/<_id>`,
            'DELETE',
            {
                token : localStorage.getItem('kento')
            }
         )
        .sendRequest()
        .then( jsonData => console.log(jsonData))
        .catch( jsonError => { console.log(jsonError) })
    })
};


/* Close popin */

const closePopin = (button) => {
    button.addEventListener('click', () => {
        button.parentElement.parentElement.parentElement.classList.add('close'); // remonte parents div>article>section
        setTimeout( () => {
        button.parentElement.parentElement.parentElement.classList.remove('open');
        button.parentElement.parentElement.parentElement.classList.remove('close');
        }, 300)
    })
};

/* Close loading */

// const closeLoading = () => {
//     loading.classList.add('close');
//     setTimeout(() => { 
//         loading.classList.remove('open');
//         loading.classList.remove('close');
//     }, 600);
// }

    // Attendre le chargement du DOM
    document.addEventListener('DOMContentLoaded', () => {

    // Lancer IHM

    if(localStorage.getItem('kento') !== null){
      // Récupérer info user avec l'user_id
      userAccount();
    }
    else{
      // Afficher les formulaires
      document.querySelector('#registerForm').classList.remove('hidden');
      document.querySelector('#loginForm').classList.remove('hidden');
    }

    getSearchSubmit();

    registerUser('#registerForm', '#registerForm [name="userEmail"]', '#registerForm [name="userPassword"]', '#registerForm [name="userPseudo"]');

    login('#loginForm', '#loginForm [name="loginEmail"]', '#loginForm [name="loginPassword"]');

  })
