//IMPORTANT
//1. Right now, the canvas where the image is created, is displayed right on the page. However, the page display is supposed to be just a preivew with image half the actual size. Right now, the canvas is half the actual size. Figure out a way to get the resulting image out of the canvas, show it on page and download. When it is achieved, do not add canvas to DOM and make it full-size. Images are also half-size!

//2. To do:
// Get random coords + size for each image according to the screen size
// Make random rectangles to test
// Add 2 layers
// Add collision/overlap detection in layer
// Replace rectangles with images
// Refine image sizing and possibly positioning

//placeholder canvas
let canvas = null;

// Get the current URL
const currentURL = window.location.href;

// Create a URL object
const url = new URL(currentURL);

// Get the 'data' parameter from the URL
const dataParam = url.searchParams.get('data');

// Parse the parameter value as JSON
const songList = JSON.parse(decodeURIComponent(dataParam));

var ratio = window.devicePixelRatio || 1;
var w = Math.round(screen.width * ratio);
var h = Math.round(screen.height * ratio);
console.log(w + 'x' + h)

document.getElementById('screenSizeTest').innerHTML += 'Your resolution: ' + w + 'x' + h + '<br> Your ratio: ' + ratio + '<br> Your image data is loaded: ';
let loadStatus = document.getElementById('screenSizeTest');

if (songList.length > 0) {
    loadStatus.innerHTML += 'true';
    // Create a canvas element
    canvas = document.createElement('canvas');

    // Set the id of the canvas element
    canvas.id = 'collageCanvas';
    canvas.width = w / 2;
    canvas.height = h / 2;

    // Get the div element with id 'collage'
    const collageDiv = document.getElementById('resultImage');

    // Append the canvas element to the div
    collageDiv.appendChild(canvas);
    let ctx = canvas.getContext('2d');
} else {
    loadStatus.innerHTML += 'false';
}