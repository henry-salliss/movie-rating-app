export const key = "c87d7d62b65ce4618fb6a823d65be34a";
export const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=`;

export const renderDetails = function (d, trailer, genres) {
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
    `
    return mediaHTML;
}