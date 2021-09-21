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

export const clearSection = function (section, title, pag) {
    section.innerHTML = '';
    title.style.opacity = 0;
    title.style.display = 'none'
    pag.style.opacity = 0;
    pag.style.display = 'none'
}

export const restoreState = function (title, pagCont, pg, func) {
    title.style.opacity = 1;
    title.style.display = 'flex'
    pagCont.style.opacity = 1;
    pagCont.style.display = 'flex'
    func('_', pg)
}