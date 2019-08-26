export default function(htmlMarkup) {
    const fakeDiv = document.createElement('div');
    fakeDiv.style.display = 'inline-block';
    fakeDiv.innerHTML = htmlMarkup;

    document.body.appendChild(fakeDiv);
    const {width, height} = fakeDiv.getBoundingClientRect();
    document.body.removeChild(fakeDiv);

    return {width, height};
}
