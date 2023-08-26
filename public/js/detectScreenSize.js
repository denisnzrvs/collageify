// Get the current URL
const currentURL = window.location.href;

// Create a URL object
const url = new URL(currentURL);

// Get the 'data' parameter from the URL
const dataParam = url.searchParams.get('data');

// Parse the parameter value as JSON
const songList = JSON.parse(decodeURIComponent(dataParam));

console.log(songList);

var ratio = window.devicePixelRatio || 1;
var w = Math.round(screen.width * ratio);
var h = Math.round(screen.height * ratio);
console.log(w + 'x' + h)

document.getElementById('screenSizeTest').innerHTML += 'Your resolution: ' + w + 'x' + h + '<br> Your ratio: ' + ratio + '<br> Your image data is loaded: ';
let loadStatus = document.getElementById('screenSizeTest');

if (songList.length > 0) {
    loadStatus.innerHTML += 'true';
} else {
    loadStatus.innerHTML += 'false';
}