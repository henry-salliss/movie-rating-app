import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import { key } from "./config";

// get elements
const input = document.querySelector("#inputField");
const searchBtn = document.querySelector("#searchBtn");
const container = document.querySelector('.container')
const popularMoviesSection = document.querySelector("#popular");
const paginationCont = document.querySelector('.pagination');
const nextPgBtn = document.querySelector('#next');
const prevPgBtn = document.querySelector('#prev')
const pageNumber = document.querySelector('#pageNum')

let page = 1
let currentData = {}

const ajax = async function (url, pg) {

    const request = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=${pg}&append_to_response=videos`)
    const data = await request.json();
    // create and insert html for popular movies
    data.results.forEach(movie => {
        const html = `
        <article class='popular-movie'>
        <div class = 'details'>
        <h2 class ='movie-title'>${movie.title}</h2>
        <p>${movie.release_date}</p>
        <p><i class="fas fa-star star"></i> ${movie.vote_average}/10</p>
        </div>
        <img class='movie-poster' src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
        </article>
        `
        popularMoviesSection.insertAdjacentHTML('beforeend', html)

        // hide prev btn if page 1
        if (page === 1) prevPgBtn.style.opacity = 0;
        page === 1 ? prevPgBtn.style.opacity = 0 : prevPgBtn.style.opacity = 1;

        currentData = data;
    });


}
ajax('_', page);

// show more movie details on click
popularMoviesSection.addEventListener('click', function (e) {
    if (e.target.parentElement.classList.contains('container')) return;
    const movieContainer = e.target.closest('article');

    const createHTML = function (data) {
        // get specific movie data
        if (!movieContainer) return;
        const dataRes = data.results.find((movie) => movie.title === movieContainer.children[0].children[0].textContent);
        console.log(dataRes);

        // get trailer
        const getMoreData = async function () {
            const request = await fetch(`
            https://api.themoviedb.org/3/movie/${dataRes.id}/videos?api_key=${key}&language=en-US`);

            const data = await request.json();
            const trailer = data.results[0].key;
            console.log(trailer);
            const link = `https://www.youtube.com/embed/${trailer}`

            const requestGenre = await fetch(`
            https://api.themoviedb.org/3/genre/movie/list?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US`);
            const genreData = await requestGenre.json();
            const genres = []
            dataRes.genre_ids.map(id => {
                genreData.genres.forEach(genre => {
                    if (genre.id === id) genres.push(genre.name)
                })
            })
            const genreHTML = `
            <p class = 'genre'>${genres}</p>
            `

            // clear the section and insert details of movie
            popularMoviesSection.innerHTML = '';
            paginationCont.style.opacity = 0;
            const oneMovieHTML = `

            <div class='popular-movie-closer-look'>
            <h2>${dataRes.title}</h2>
            <div class="mini-details">
                ${genreHTML}
                <p class="rating">${dataRes.vote_average}<i class="fas fa-star star"></i></p>
                <p>Pop rating: ${Math.floor(dataRes.popularity)}</p>
            </div>
            <iframe class='trailers' src=${link} height="200" width="300"
                allowfullscreen='true' title="${dataRes.title} trailer"></iframe>
            <p class="overview">${dataRes.overview}</p>
        </div>
            `
            console.log(dataRes.overview);
            popularMoviesSection.insertAdjacentHTML('afterbegin', oneMovieHTML)
        };
        getMoreData();


    }
    createHTML(currentData);

});


// Make next pagination work
nextPgBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const pg = page += 1;
    pageNumber.textContent = `Page ${pg}`
    popularMoviesSection.innerHTML = '';
    ajax('_', pg);
})

// Make previous pagination work
prevPgBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (page === 1) return;
    const pg = page -= 1;
    pageNumber.textContent = `Page ${pg}`;
    popularMoviesSection.innerHTML = '';
    ajax('_', pg)
})




const genreAjax = async function () {

}

genreAjax();



