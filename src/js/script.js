import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
// import { url } from "./config";
// import { key } from "./config";

// get elements
const input = document.querySelector("#inputField");
const searchBtn = document.querySelector("#searchBtn");
const popularMoviesSection = document.querySelector("#popular");
const nextPgBtn = document.querySelector('#next');
const prevPgBtn = document.querySelector('#prev')
const pageNumber = document.querySelector('#pageNum')

let page = 1

const ajax = async function (url, pg) {

    const request = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US&page=${pg}&append_to_response=videos`)

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
    });


}
ajax('_', page);

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

popularMoviesSection.addEventListener('click', function (e) {
    // console.log(e.target.closest('article'));
    console.log(e.target.parentElement);
})



const genreAjax = async function () {
    const request = await fetch(`
    https://api.themoviedb.org/3/genre/movie/list?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US`);
    const data = await request.json();
    console.log(data);
}

genreAjax();

const test = async function () {
    const request = await fetch(`https://api.themoviedb.org/3/movie/297762?api_key=c87d7d62b65ce4618fb6a823d65be34a&append_to_response=videos`)
    const data = await request.json();
    console.log(data);
}
test();