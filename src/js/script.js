import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import { key } from "./config";

// get elements
const container = document.querySelector('.container')
const input = document.querySelector("#inputField");
const searchBtn = document.querySelector("#searchBtn");
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
    // create and insert html for trending movies
    data.results.forEach(movie => {
        if (movie.media_type === 'movie') {
            const html = `
            <article class='movie-tile'>
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
        // html for trending tv shows

        if (movie.media_type === 'tv') {
            const html = `
            <article class='movie-tile'>
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
        if (!movieContainer) return;
        const mediaType = movieContainer.children[0].children[1].textContent;
        if (mediaType === '(movie)') {
            // get specific movie data
            const dataRes = data.results.find((movie) => movie.title === movieContainer.children[0].children[0].textContent);
            // insert html for movie details
            const html = await movieDetailed(dataRes);
            popularMoviesSection.insertAdjacentHTML('afterbegin', html);
        }
        if (mediaType === '(tv)') {
            // get tv data from results
            const tvData = data.results.find(tvShow => tvShow.name === movieContainer.children[0].children[0].textContent)
            const tvHTML = await tvDetailed(tvData);
            popularMoviesSection.insertAdjacentHTML('afterbegin', tvHTML);
        };



    }
    createHTML(currentData);

});


// make back button work
popularMoviesSection.addEventListener('click', function (e) {
    e.preventDefault();
    const backBtn = document.querySelector('#backBtn')
    if (e.target === backBtn) {
        // clear details and similar media section
        // document.querySelector('.popular-movie-closer-look').remove()
        document.querySelector('.popular-movie-closer-look').innerHTML = '';
        // document.querySelector('.similar-media').remove();
        document.querySelector('.similar-media').innerHTML = '';
        backBtn.remove();

        // restore original state
        title.style.opacity = 1;
        paginationCont.style.opacity = 1;
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
    const movieData = await request.json();
    const trailer = movieData.results[0].key;
    const link = `https://www.youtube.com/embed/${trailer}`

    // get movie genres
    const genres = await getGenre(d);

    // clear the section and insert details of movie
    popularMoviesSection.innerHTML = '';
    title.style.opacity = 0;
    paginationCont.style.opacity = 0;

    // render the detailed html
    const html = renderDetails(d, link, genres)

    // get similar shows
    const similar = await getSimilar(d);
    insertSimilar(similar)

    return html;

};


const tvDetailed = async function (d) {
    const tvRequest = await fetch(`https://api.themoviedb.org/3/tv/${d.id}?api_key=${key}&language=en-US`)

    const tvData = await tvRequest.json();

    // get trailer
    const getTrailer = await fetch(`https://api.themoviedb.org/3/tv/${d.id}/videos?api_key=${key}&language=en-US`)

    const trailerData = await getTrailer.json();
    console.log(getTrailer);
    const trailer = trailerData.results[0].key;;
    const link = `https://www.youtube.com/embed/${trailer}`


    // get genres
    const genres = await getGenre(d);


    // clear the section and insert details of movie
    popularMoviesSection.innerHTML = '';
    title.style.opacity = 0;
    paginationCont.style.opacity = 0;

    const html = renderDetails(d, link, genres)

    // get similar shows
    const similar = await getSimilar(d);
    insertSimilar(similar)
    return html;
}


// create detailed HTML for media

const renderDetails = function (d, trailer, genres) {
    const mediaHTML = `
    <button ><i class="fas fa-arrow-left" id="backBtn"></i></button>
    <div class='popular-movie-closer-look'>
    <h2>${d.title || d.name}</h2>
    <div class="mini-details">
    <p class = 'genre'>${genres}</p>
        <p class="rating">${d.vote_average}<i class="fas fa-star star"></i></p>
        <p>Pop rating: ${Math.floor(d.popularity)}</p>
    </div>
    <iframe class='trailers' src=${trailer} height="200" width="300"
        allowfullscreen='true' title="${d.title || d.name} trailer"></iframe>
    <p class="overview">${d.overview}</p>
    </div>
    <section class = 'similar-media'></section>
    `

    console.log(mediaHTML);
    return mediaHTML;
}

// get similar media data
const getSimilar = async function (data) {
    const request = await fetch(`
    https://api.themoviedb.org/3/movie/${data.id}/similar?api_key=${key}&language=en-US&page=1`);

    const similarData = await request.json();

    return similarData;
}

// similar shows and movies html
const insertSimilar = function (data) {
    if (data.results.length === 0) return;
    // wait 1 second so similar media section is not null
    setTimeout(() => {
        const section = document.querySelector('.similar-media')
        // get first five results
        const firstFive = data.results.slice(0, 5);
        console.log(section);
        section.insertAdjacentHTML('afterbegin', `<h1>Other stuff you should check out</h1>`)
        firstFive.forEach(similarMedia => {
            const html = `
                <article class='movie-tile'>
                <div class = 'details'>
                <h2 class ='movie-title'>${similarMedia.title}</h2>
                <p>${similarMedia.release_date}</p>
                <p><i class="fas fa-star star"></i> ${Math.floor(similarMedia.vote_average)}/10</p>
                </div>
                <img class='movie-poster' src='https://image.tmdb.org/t/p/w500${similarMedia.poster_path}'>
                </article>
            `
            section.insertAdjacentHTML('beforeend', html);


        })
        // get more details of similar media
        section.addEventListener('click', function (e) {
            if (e.target.classList.contains('similar-media')) return;
            // hide section
            // section.remove();
            section.innerHTML = '';
            document.querySelector('.popular-movie-closer-look').remove()
        })
    }, 1000)
}

// get genre of media

const getGenre = async function (data) {
    const requestGenre = await fetch(`
    https://api.themoviedb.org/3/genre/movie/list?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US`);
    const genreData = await requestGenre.json();
    const genres = [];
    data.genre_ids.map(id => {
        genreData.genres.forEach(genre => {
            if (genre.id === id) genres.push(genre.name)
        })
    })

    return genres;
}



// Make search bar work
const searchData = async function (query) {
    const request = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&query=${query}&page=1&include_adult=false`);

    const data = await request.json();

    if (data.results[0].media_type === 'tv') {
        const html = await tvDetailed(data.results[0]);
        container.insertAdjacentHTML('beforeend', html)
    }
    if (data.results[0].media_type === 'movie') {
        const html = await movieDetailed(data.results[0]);
        container.insertAdjacentHTML('beforeend', html)
    }
};

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (input.value === '') return;
    searchData(input.value);
})

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (input.value === '') return;
        searchData(input.value);
    }
})