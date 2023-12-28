//IMPORTANT
//1. Right now, the canvas where the image is created, is displayed right on the page. However, the page display is supposed to be just a preivew with image half the actual size. Right now, the canvas is half the actual size. Figure out a way to get the resulting image out of the canvas, show it on page and download. When it is achieved, do not add canvas to DOM and make it full-size. Images are also half-size!

//2. To do:
// Add 2 layers - refactor ovelap detection to work within isolated layers
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

            let coords = getRandomCoords(imgWidth, imgHeight);

            ctx.drawImage(image, coords[0], coords[1], imgWidth, imgHeight);

            // Add the image to the squares array
            squares.push({
                x: coords[0],
                y: coords[1],
                width: imgWidth,
                height: imgHeight
            });

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


function isOverlap(x, y, width, height) {
    for (let i = 0; i < squares.length; i++) {
        let square = squares[i];
        if (x < square.x + square.width &&
            x + width > square.x &&
            y < square.y + square.height &&
            y + height > square.y) {
            return true;
        }
    }
    return false;
}

function getImageSide() {
    return 300 * ratio;
}

function getRandomCoords(width, height) {
    let x, y;
    let overlap = false;

    do {
        x = Math.floor(Math.random() * (canvas.width - width));
        y = Math.floor(Math.random() * (canvas.height - height));

        overlap = squares.some(square => {
            return x < square.x + square.width &&
                x + width > square.x &&
                y < square.y + square.height &&
                y + height > square.y;
        });
    } while (overlap);

    return [x, y];
}

