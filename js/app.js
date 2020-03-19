

    // Déclarations

        // API Front The Movie Data Base
    const themoviedbUrl = 'https://api.themoviedb.org/3/search/movie?api_key=6fd32a8aef5f85cabc50cbec6a47f92f&query=';

        // API Node Back-end Julien NOYER
    const apiUrl = 'https://api.dwsapp.io'; //Register/login/favori (API Node)

        // Local Storage
    const localSt = 'fzfzhfskd';

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

    // Register

    new FETCHrequest(`${apiUrl}/api/register`, 'POST')
    .sendRequest()
    .then( jsonData => {
        console.log(jsonData)
    })
    .catch( jsonError => {
        console.log(jsonError);
    })



document.addEventListener('DOMContentLoaded', () => {


});