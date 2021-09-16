export const key = "c87d7d62b65ce4618fb6a823d65be34a";
export const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=`;

export const renderError = function (msg, cont) {
    const html = `
    <div class="error-container">
    <p class = 'errMessage'>
    <i class="fas fa-exclamation-circle"></i>
    <i class="fas fa-times delErr"></i>     
    </p>
    
    <p class="err-message">${msg}</p>
    </div>
    `;

    cont.classList.add('overlay');
    cont.insertAdjacentHTML('beforebegin', html);
};