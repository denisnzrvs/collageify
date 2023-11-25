//IMPORTANT
//1. Right now, the canvas where the image is created, is displayed right on the page. However, the page display is supposed to be just a preivew with image half the actual size. Right now, the canvas is half the actual size. Figure out a way to get the resulting image out of the canvas, show it on page and download. When it is achieved, do not add canvas to DOM and make it full-size. Images are also half-size!

//2. To do:
// Add 2 layers
// Add collision/overlap detection in layer
// Replace rectangles with images
// Refine image sizing and possibly positioning

//stores squares on layer
let squares = [];

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
console.log(songList);
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
    canvas.width = w;
    canvas.height = h;
    // Get the div element with id 'resultImage'
    const collageDiv = document.getElementById('resultImage');
    collageDiv.style.height = h / 2 + 'px';
    collageDiv.style.width = w / 2 + 'px';
    // Append the canvas element to the div
    collageDiv.appendChild(canvas);

    // Get the 2D rendering context of the canvas
    let ctx = canvas.getContext('2d');

    // Use the correct function call to get random coordinates
    let coords = getRandomCoords();

    // Counter to track loaded images
    let loadedImageCount = 0;

    // Load images and draw on canvas
    for (let i = 0; i < 10; i++) {
        let coords = getRandomCoords();
        let image = new Image();

        // Set the source of the image to the imageURL in songList
        image.src = songList[i];

        // Set up the onload event to track when the image is loaded
        image.onload = function () {
            let aspectRatio = image.width / image.height;
            let imgWidth = Math.min(getImageSide(), getImageSide() * aspectRatio);
            let imgHeight = Math.min(getImageSide(), getImageSide() / aspectRatio);

            ctx.drawImage(image, coords[0], coords[1], imgWidth, imgHeight);

            // Increment the loaded image count
            loadedImageCount++;

            canvas.crossOrigin = "anonymous";
            // Check if all images are loaded before setting href
            if (loadedImageCount === 10) {
                const downloadButton = document.getElementById('downloadBtn');
                downloadButton.href = canvas.toDataURL();
            }
        };
    }
} else {
    loadStatus.innerHTML += 'false';
}

function getImageSide() {
    return 300 * ratio;
}

function getRandomCoords() {
    let x, y;
    let isValid = false;

    do {
        x = Math.floor(Math.random() * (w - getImageSide())); // Adjusted the calculation
        y = Math.floor(Math.random() * (h - getImageSide())); // Adjusted the calculation
        console.log('possible coords: ' + x + ' ' + y);

        if (x < w - getImageSide() || y < h - getImageSide()) {
            isValid = true;
        }
    } while (!isValid);

    console.log('found coords: ' + x + ' ' + y);
    console.log('image side: ' + getImageSide());

    return [x, y];
}

// Adjusted the function to accept the rendering context
function makeSquares(ctx, count) {
    for (let i = 0; i < count; i++) {
        let coords = getRandomCoords();
        let image = new Image();
        image.crossOrigin = "anonymous";

        // Set the source of the image to the imageURL in songList
        image.src = songList[i];

        // Draw the image on the canvas
        image.onload = function () {
            // Maintain aspect ratio while drawing the image
            let aspectRatio = image.width / image.height;
            let imgWidth = Math.min(getImageSide(), getImageSide() * aspectRatio);
            let imgHeight = Math.min(getImageSide(), getImageSide() / aspectRatio);

            // Draw the image on the canvas
            ctx.drawImage(image, coords[0], coords[1], imgWidth, imgHeight);
        }

        console.log("Image drawn, do you see it?");
    }
}