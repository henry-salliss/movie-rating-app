import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import { key } from "./config";
import { renderError } from './config';

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
const watchlistBtn = document.querySelector('#watchlistBtn')
const watchlistSection = document.querySelector('.watchlist-items')

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
            if (typeof tvHTML === 'undefined') return;
            popularMoviesSection.insertAdjacentHTML('afterbegin', tvHTML);
        };



    }
    createHTML(currentData);
});


// make back button work
container.addEventListener('click', function (e) {
    e.preventDefault();
    const backBtn = document.querySelector('#backBtn')
    if (e.target === backBtn) {
        // clear details and similar media section
        backBtn.remove();
        document.querySelector('.closer-look').innerHTML = '';
        document.querySelector('.closer-look').style.display = 'none'


        // restore original state
        title.style.opacity = 1;
        title.style.display = 'flex'
        paginationCont.style.opacity = 1;
        paginationCont.style.display = 'flex'
        ajax('_', page)

        // clear similar media
        const similar = document.querySelector('.similar-media');
        if (similar !== null) similar.innerHTML = '';

        // clear known for media
        const knownFor = document.querySelector('.known-for');
        if (knownFor !== null) knownFor.remove();
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

// make save btn work

let watchlist = [];
container.addEventListener('click', function (e) {
    if (!e.target.classList.contains('saved')) return;
    e.preventDefault();
    if (!e.target.classList.contains('in-watchlist')) {
        e.target.classList.add('in-watchlist');
        e.target.textContent = 'Remove from watchlist'
        // set watchlist to local storage
        watchlist = JSON.parse(localStorage.getItem("watchlist"));
        if (watchlist === null) watchlist = [];

        // get name of media
        const nameOfMedia = e.target.parentElement.children[0].textContent;

        // update array and local storage
        watchlist.push(nameOfMedia);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));

        // change text on btn
        if (e.target.classList.contains('in-watchlist')) e.target.textContent = 'Remove from watchlist';

        // show message
        watchlistMessage('Added to watchlist', watchlistBtn);
    } else if (e.target.classList.contains('in-watchlist')) {
        e.target.classList.remove('in-watchlist')
        e.target.textContent = 'Save to watchlist'

        // get local storage and name of media
        const local = JSON.parse(localStorage.getItem('watchlist'));
        const nameOfMedia = e.target.parentElement.children[0].textContent;

        // remove media from watchlist array and local storage
        const index = watchlist.indexOf(nameOfMedia);
        watchlist.splice(index, 1);
        local.splice(index, 1);

        // update local storage
        localStorage.setItem("watchlist", JSON.stringify(local));


        // show message
        watchlistMessage('Removed from watchlist', watchlistBtn);
    }
})

// show message on watchlist save/remove

const watchlistMessage = function (msg, location) {
    const html = `
      <div class="favourite-message">
      <p class="fav-msg">${msg} <i class="fas fa-film"></i></p>
      </div>
      `;

    location.insertAdjacentHTML("beforebegin", html);
    setTimeout(() => {
        document.querySelector(".favourite-message").remove();
    }, 750);
};

// show watchlist on click
watchlistBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (!watchlistSection.classList.contains('reveal')) {
        watchlistSection.classList.add('reveal');
        // show box section of all names of saved shows
        const watchlistItems = JSON.parse(localStorage.getItem("watchlist"));
        watchlistItems.forEach(item => {
            const html = `<p class="item">${item}</p>`
            watchlistSection.insertAdjacentHTML('afterbegin', html);
        })

    } else if (watchlistSection.classList.contains('reveal')) {
        watchlistSection.classList.remove('reveal')
        watchlistSection.innerHTML = '';
    }
})

watchlistSection.addEventListener('click', function (e) {
    if (!e.target.classList.contains('item')) return;

    searchData(e.target.textContent)
    watchlistSection.classList.remove('reveal')
    watchlistSection.innerHTML = '';
})




const movieDetailed = async function (d) {

    let local = JSON.parse(localStorage.getItem('watchlist'));
    if (local === null) local = ''

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
    title.style.display = 'none'
    paginationCont.style.opacity = 0;
    // paginationCont.style.height = 0;
    paginationCont.style.display = 'none'

    // render the detailed html
    const html = renderDetails(d, link, genres, local)

    // get similar shows
    const similar = await getSimilar(d);
    insertSimilar(similar)

    return html;

};


const tvDetailed = async function (d) {

    let local = JSON.parse(localStorage.getItem('watchlist'));
    if (local === null) local = ''

    const tvRequest = await fetch(`https://api.themoviedb.org/3/tv/${d.id}?api_key=${key}&language=en-US`)

    const tvData = await tvRequest.json();

    // get trailer
    const getTrailer = await fetch(`https://api.themoviedb.org/3/tv/${d.id}/videos?api_key=${key}&language=en-US`)

    const trailerData = await getTrailer.json();
    if (trailerData.results.length > 0) {
        const trailer = trailerData.results[0].key;
        const link = `https://www.youtube.com/embed/${trailer}`

        // get genres
        const genres = await getGenre(d);


        // clear the section and insert details of movie
        popularMoviesSection.innerHTML = '';
        title.style.opacity = 0;
        title.style.display = 'none'
        paginationCont.style.opacity = 0;
        paginationCont.style.display = 'none'

        const html = renderDetails(d, link, genres, local)

        // get similar shows
        const similar = await getSimilar(d);
        insertSimilar(similar)
        return html;
    }

    // if no trailer available

    // get genres
    const genres = await getGenre(d);

    // clear the section and insert details of movie
    popularMoviesSection.innerHTML = '';
    title.style.opacity = 0;
    title.style.display = 'none'
    paginationCont.style.opacity = 0;
    paginationCont.style.display = 'none'

    const html = renderDetails(d, '_', genres, local)

    // get similar shows
    const similar = await getSimilar(d);
    insertSimilar(similar)
    return html;
    // renderError('Could not get latest data for show try again later', container)
};

const personDetailed = async function (data) {
    const html = `
    ${typeof backBtn != 'undefined' ? '' : '<button ><i class="fas fa-home" id="backBtn"></i></button>'}
    <div class = 'closer-look'>
    <h2>${data.name}</h2>
    <div class="mini-details">
    <p class = 'gender'>${data.gender === 1 ? 'Female' : 'Male'}</p>
        <p class="rating">${data.known_for_department} 🎬</p>
        <p>Pop rating: ${Math.floor(data.popularity)}<i class="fas fa-star star"></i></p>
    </div>
    <div class = 'personImg'>
    <img class ='person-poster'src = 'https://image.tmdb.org/t/p/w500${data.profile_path}'>
    </div>
    </div>

    <section class = 'known-for'>
    <h1>Known for...</h1
    </section>
    `

    setTimeout(() => {
        const knownForMovies = document.querySelector('.known-for');
        data.known_for.forEach(movie => {
            const knownForHTML = `
            <article class='movie-tile'>
            <div class = 'details'>
            <h2 class ='movie-title'>${movie.title}</h2>
            <p>${movie.release_date}</p>
            <p><i class="fas fa-star star"></i> ${Math.floor(movie.vote_average)}/10</p>
            </div>
            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
            </article>
            `
            knownForMovies.insertAdjacentHTML('beforeend', knownForHTML);
        })
        // look at known for movies
        container.addEventListener('click', function (e) {
            // conditions
            if (e.target.classList.contains('known-for') || e.target.parentElement === null) return;
            if (typeof knownForMovies === 'undefined') return;
            if (e.target.parentElement.classList.contains('similar-media') || e.target.parentElement.classList.contains('details')) {
                knownForMovies.innerHTML = '';
                const closeLook = document.querySelector('.closer-look');
                if (typeof closeLook != 'null' || typeof closeLook != 'never') {
                    closeLook.remove()
                    const title = e.target.closest('article').children[0].children[0].textContent;
                    searchData(title)
                }
            }
        })
    }, 1000)
    // clear the section and insert details of movie
    popularMoviesSection.innerHTML = '';
    title.style.opacity = 0;
    title.style.display = 'none'
    paginationCont.style.opacity = 0;
    paginationCont.style.display = 'none'

    return html
}


// create detailed HTML for media

const renderDetails = function (d, trailer, genres, local) {
    let media;

    // make media a trailer or poster depending if trailer exists
    if (trailer === '_') media = `<img class ='stand-in-poster' src='https://image.tmdb.org/t/p/w500${d.poster_path}'></img>`;

    if (trailer !== '_') media = `<iframe class='trailers' src=${trailer} height="200" width="300"
    allowfullscreen='true' title="${d.title || d.name} trailer"></iframe>`



    const mediaHTML = `
    ${typeof backBtn != 'undefined' ? '' : '<button ><i class="fas fa-home" id="backBtn"></i></button>'}
    
    <div class='closer-look'>
    <h2>${d.title || d.name}</h2>
    <div class="mini-details">
    <p class = 'genre'>${genres}</p>
        <p class="rating">${d.vote_average}<i class="fas fa-star star"></i></p>
        <p>Pop rating: ${Math.floor(d.popularity)}</p>
    </div>
    ${media}
    <p class="overview">${d.overview}</p>
    <button class = 'saved ${local.includes(d.title || d.name) ? 'in-watchlist' : ''}' id='saveBtn '> ${local.includes(d.title || d.name) ? 'Remove from' : 'Save to'} watchlist</button>
    </div>
    <section class = 'similar-media'></section>
    `

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
    if (data.success === false || data.results.length === 0) return;
    // wait 1 second so similar media section is not null
    setTimeout(() => {
        const section = document.querySelector('.similar-media')
        // get first five results
        const firstFive = data.results.slice(0, 5);
        section.insertAdjacentHTML('beforeend', `<h1 class='mini-heading'>Other stuff you should check out</h1>`)
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
        container.addEventListener('click', function (e) {
            if (e.target.classList.contains('similar-media') || e.target.parentElement === null) return;
            if (e.target.parentElement.classList.contains('similar-media') || e.target.parentElement.classList.contains('details')) {
                // hide section
                section.innerHTML = '';
                if (typeof section === 'undefined') return;
                const closeLook = document.querySelector('.closer-look');
                if (typeof closeLook != 'null' || typeof closeLook != 'never') {
                    if (closeLook === null) return;
                    closeLook.remove()
                    const title = e.target.closest('article').children[0].children[0].textContent;
                    searchData(title)
                }
            }
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
    try {
        const request = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&query=${query}&page=1&include_adult=false`);

        const data = await request.json();
        // show details for tv search
        if (data.results[0].media_type === 'tv') {
            const html = await tvDetailed(data.results[0]);
            container.insertAdjacentHTML('afterbegin', html)
        }
        // show details for movie search
        if (data.results[0].media_type === 'movie') {
            popularMoviesSection.innerHTML = '';
            const html = await movieDetailed(data.results[0]);
            // container.insertAdjacentHTML('afterbegin', html)
            popularMoviesSection.innerHTML = html;
        }
        // show details for person search
        if (data.results[0].media_type === 'person') {
            popularMoviesSection.innerHTML = '';
            const html = await personDetailed(data.results[0]);
            popularMoviesSection.innerHTML = html;
        }
    } catch (err) {
        renderError('We could not find something matching your search please try again', container)
    }
};

// make search button and enter key search for media

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (input.value === '') return;
    searchData(input.value);
})

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (input.value === '') return;
        searchData(input.value);
        input.value = '';
    }
})

// make x btn on error container work

document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('delErr')) return;
    // restore original state
    title.style.opacity = 1;
    title.style.display = 'flex';
    paginationCont.style.opacity = 1;
    paginationCont.style.display = 'flex'
    ajax('_', page)
    container.classList.remove('overlay')

    // remove error
    const errContainer = document.querySelector('.error-container');
    errContainer.remove();
})