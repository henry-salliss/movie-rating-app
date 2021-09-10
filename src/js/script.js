import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import { key } from "./config";

// get elements
const input = document.querySelector("#inputField");
const searchBtn = document.querySelector("#searchBtn");
const container = document.querySelector('.container')
const title = document.querySelector('.title')
const popularMoviesSection = document.querySelector("#popular");
const paginationCont = document.querySelector('.pagination');
const nextPgBtn = document.querySelector('#next');
const prevPgBtn = document.querySelector('#prev')
const pageNumber = document.querySelector('#pageNum')


let page = 1
let currentData = {}

const ajax = async function (url, pg) {

    const request = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}&language=en-US&page=${pg}&append_to_response=videos`)
    const data = await request.json();
    // create and insert html for popular movies
    data.results.forEach(movie => {
        if (movie.media_type === 'movie') {
            const html = `
            <article class='popular-movie'>
            <div class = 'details'>
            <h2 class ='movie-title'>${movie.title}</h2>
            <span class = 'media-type'>(${movie.media_type})</span>
            <p>${movie.release_date}</p>
            <p><i class="fas fa-star star"></i> ${movie.vote_average}/10</p>
            </div>
            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
            </article>
            `
            popularMoviesSection.insertAdjacentHTML('beforeend', html)
        }

        if (movie.media_type === 'tv') {
            const html = `
            <article class='popular-movie'>
            <div class = 'details'>
            <h2 class ='movie-title'>${movie.name}</h2>
            <span class = 'media-type'>(${movie.media_type})</span>
            <p>${movie.first_air_date}</p>
            <p><i class="fas fa-star star"></i> ${movie.vote_average}/10</p>
            </div>
            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
            </article>
            `
            popularMoviesSection.insertAdjacentHTML('beforeend', html)
        }

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
    const createHTML = async function (data) {
        console.log(data);
        if (!movieContainer) return;
        const mediaType = movieContainer.children[0].children[1].textContent;
        if (mediaType === '(movie)') {
            // get specific movie data
            console.log(movieContainer.children[0].children[0]);
            const dataRes = data.results.find((movie) => movie.title === movieContainer.children[0].children[0].textContent);
            tvDetailed(dataRes)
            // insert html for movie details
            const html = await movieDetailed(dataRes);
            popularMoviesSection.insertAdjacentHTML('afterbegin', html);
        }
        // if (mediaType === '(tv)') {
        //     console.log(movieContainer.children[0].children[0].textContent);
        //     const dataRes = data.results.find((movie) => movie.name === movieContainer.children[0].children[0].textContent);
        //     console.log(dataRes);
        //     // insert html for movie details
        //     const html = await movieDetailed(dataRes);
        //     popularMoviesSection.insertAdjacentHTML('afterbegin', html);
        // }


    }
    createHTML(currentData);

});


// make back button work
popularMoviesSection.addEventListener('click', function (e) {
    e.preventDefault();
    const backBtn = document.querySelector('#backBtn')
    if (e.target === backBtn) {
        document.querySelector('.popular-movie-closer-look').remove()
        backBtn.remove();
        title.style.opacity = 1;
        ajax('_', page)
    }
})

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





const movieDetailed = async function (d) {
    const request = await fetch(`
    https://api.themoviedb.org/3/movie/${d.id}/videos?api_key=${key}&language=en-US`);

    // get movie trailer
    const data = await request.json();
    const trailer = data.results[0].key;
    const link = `https://www.youtube.com/embed/${trailer}`

    // get movie genres
    const requestGenre = await fetch(`
    https://api.themoviedb.org/3/genre/movie/list?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US`);
    const genreData = await requestGenre.json();
    const genres = []
    d.genre_ids.map(id => {
        genreData.genres.forEach(genre => {
            if (genre.id === id) genres.push(genre.name)
        })
    })
    const genreHTML = `
    <p class = 'genre'>${genres}</p>
    `

    // clear the section and insert details of movie
    popularMoviesSection.innerHTML = '';
    title.style.opacity = 0;
    paginationCont.style.opacity = 0;
    const oneMovieHTML = `
    <button ><i class="fas fa-arrow-left" id="backBtn"></i></button>
    <div class='popular-movie-closer-look'>
    <h2>${d.title || d.name}</h2>
    <div class="mini-details">
        ${genreHTML}
        <p class="rating">${d.vote_average}<i class="fas fa-star star"></i></p>
        <p>Pop rating: ${Math.floor(d.popularity)}</p>
    </div>
    <iframe class='trailers' src=${link} height="200" width="300"
        allowfullscreen='true' title="${d.title} trailer"></iframe>
    <p class="overview">${d.overview}</p>
</div>
    `
    return oneMovieHTML;
};

// const testTrending = async function () {
//     const request = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`);

//     const data = await request.json();
//     console.log(data);
// }

const tvDetailed = async function (d) {
    const tvRequest = await fetch(`https://api.themoviedb.org/3/tv/${d.id}?api_key=${key}&language=en-US`)

    const tvData = await tvRequest.json();
    console.log(tvData);

    // get trailers
    const getTrailer = await fetch(`https://api.themoviedb.org/3/tv/${d.id}/videos?api_key=${key}&language=en-US`)

    const trailer = await getTrailer.json();
    console.log(trailer);
}
