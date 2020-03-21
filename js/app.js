

    // Déclarations

        // API Front The Movie Data Base
    const themoviedbUrl = 'https://api.themoviedb.org/3/search/movie/550?api_key=5d88944cd5014d24a58b2687db97f9ee&language=en-US&query=';

    // API Node Back-end Julien NOYER
    const apiUrl = 'https://kebabtv.dwsapp.io'; //Register/login/favori (API Node)

        // Local Storage
    const localSt = 'kento';

        // Navigation
    const mainNav = document.querySelector('header nav');

        // Register
    const registerForm = document.querySelector('#registerForm');
    const userEmail = document.querySelector('[name="userEmail"]');
    const userPassword = document.querySelector('[name="userPassword"]');
    const userPseudo = document.querySelector('[name="userPseudo"]');

        // Login 
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('[name="loginEmail"]');
    const loginPassword = document.querySelector('[name="loginPassword"]');

        // Search
    const searchForm = document.querySelector('#searchForm');
    const searchLabel = document.querySelector('#searchForm span');
    const searchData = document.querySelector('[name="searchData"]');

        // Movies & Bookmarks
    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article');
    const favoriteList = document.querySelector('#favorite ul');

        // Loading
    const loading = document.querySelector('#loading');

        // Error
    const formError = document.querySelector('#formError');


// Functions

    // Search films

    searchForm.addEventListener('submit', event => {
        // Stop event propagation
        event.preventDefault();

        new FETCHrequest(
            `${themoviedbUrl}${searchData.value}&page=1`,
            'GET'
         )
    .sendRequest()
    .then( fetchMovie => {
        console.log(fetchMovie)
        // Afficher liste films
        displayMovieList(fetchMovie.results);
    })
    .catch( fetchError => {
        console.log(fetchError);
    })
});  

    // Afficher liste films

    const displayMovieList = (listSearch) => {
        movieList.innerHTML = '';

        for (let i = 0; i < listSearch.length; i++) {

            let film = listSearch[i];

            let coverFilm = listSearch[i].poster_path;
            coverFilm !== null
            ? film.poster_path
            : '.img/blankCover.jpg'

            movieList.innerHTML += `
                <article>
                    <figure>
                        <img src="${coverFilm}" alt="${film.original_title}">
                        <figcaption>${film.original_title}</figcaption>
                    </figure>
                </article>
            `
        }
    };

    // Register

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
    });

    // Login

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
    me();
    })
    .catch( jsonError => {
        console.log(jsonError);
    })
});

    // Récupérer données utilisateur

    const me = () => {
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

    // Valider souscription formulaire

    const formSubmission = (formTag, ...inputs) => {
        return new Promise( (resolve, reject) => {
            // Capter la soumission d'un formulaire puis...
            document.querySelector(formTag).addEventListener('submit', event => {
                // Bloquer le comportement par défaut de l'événement
                event.preventDefault();

                // Création d'un objet pour récupérer les données du formulaire
                let formData = {};

                // Création d'un objet pour les erreurs
                let formErrorObject = {};

                // Récupérer la valeur des inputs
                for( let item of document.querySelectorAll(inputs) ){
                    // Vérifier les champs
                    if( item.value.length < +item.getAttribute('minlength') ){ 
                        // Ajouter les errues du formulaire
                        formErrorObject[item.getAttribute('name')] = 'error';
                    };

                    // Ajouter les données du formulaire
                    formData[item.getAttribute('name')] = item.value;
                };

                // Vérifier les erreurs
                if( formErrorObject === {} ){ return reject(formErrorObject) }
                else{ return resolve(formData) };
            })
        });
    };


    // Ajouter favoris films

    const addFavorite = (film) => {
        formSubmission(loginForm, ...inputs)

        new FETCHrequest(
            `${apiUrl}/api/favorite`,
            'POST',
            {
                id : film.id,
                title : film.original_title,
                token : localStorage.getItem('kento')
            }
         )
    .sendRequest()
    .then( jsonData => {
        // Ajouter favoris liste
        console.log(jsonData)

    })
    .catch( jsonError => {
        console.log(jsonError);
    })
    };


    // Supprimer favoris films

    const deleteFavorite = (film) => {
        formSubmission(loginForm, ...inputs)

        new FETCHrequest(
            `${apiUrl}/api/favorite/<_id>`,
            'DELETE',
            {
                token : localStorage.getItem('kento')
            }
         )
    .sendRequest()
    .then( jsonData => {
        // Ajouter favoris liste
        console.log(jsonData)

    })
    .catch( jsonError => {
        console.log(jsonError);
    })
    };


document.addEventListener('DOMContentLoaded', () => {

            // Vérifier la présence d'un token en Local Storage
            if(localStorage.getItem(localSt) !== null){
                // Récupérer les informations utilisateur grâce au token
                me();
            }
            else{
                /* 
                Afficher les formulaires registerForm et loginForm
                */
                    document.querySelector('#registerForm').classList.remove('hidden');
                    document.querySelector('#loginForm').classList.remove('hidden');
                //
    
                /* 
                Capter la soumission des formulaires
                */
                    formSubmission(
                        '#registerForm', 
                        '#registerForm [name="email"]', 
                        '#registerForm [name="password"]', 
                        '[name="pseudo"]' 
                    )
                    .then( formData => register(formData))
                    .catch( formError => console.log(formError));
    
                    formSubmission(
                        '#loginForm', 
                        '#loginForm [name="email"]', 
                        '#loginForm [name="password"]'
                    )
                    .then( formData => login(formData))
                    .catch( formError => console.log(formError));
                //
            };

});


// Pop in