//IMPORTANT
//1. Right now, the canvas where the image is created, is displayed right on the page. However, the page display is supposed to be just a preivew with image half the actual size. Right now, the canvas is half the actual size. Figure out a way to get the resulting image out of the canvas, show it on page and download. When it is achieved, do not add canvas to DOM and make it full-size. Images are also half-size!

//2. To do:
// Refine image sizing and possibly positioning
let songList = [];

//stores images on canvases on layer
let squares = [];

//placeholder canvas
let canvas = null;

//placeholder ctx
let ctx = null;

//placeholder width
let w = 0;

//placeholder height
let h = 0;

let ratio = 0;



function loadURLparams() {

    // Get the current URL
    const currentURL = window.location.href;

    // Create a URL object
    const url = new URL(currentURL);

    // Get the 'data' parameter from the URL
    const dataParam = url.searchParams.get('data');

    // Parse the parameter value as JSON
    songList = JSON.parse(decodeURIComponent(dataParam));
    console.log(songList); // DEBUG

    getScreenSize();
}

//sets up the collage canvas and div for displaying it
function setupCollage() {

    // Create a canvas element
    canvas = document.createElement('canvas');

    // Set id, dimensions of the canvas element
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
    ctx = canvas.getContext('2d');

}

function getScreenSize() {

    ratio = window.devicePixelRatio || 1;
    w = Math.round(screen.width * ratio);
    h = Math.round(screen.height * ratio);
    console.log(w + 'x' + h)

    document.getElementById('screenSizeTest').innerHTML += 'Your resolution: ' + w + 'x' + h + '<br> Your ratio: ' + ratio + '<br> Your image data is loaded: '; // DEBUG
    if (songList.length > 0) {
        document.getElementById('screenSizeTest').innerHTML += ' true';
        setupCollage();
        drawLayer1(0)
    } else {
        document.getElementById('screenSizeTest').innerHTML += ' false';
    }


}


window.onload = function () {

    loadURLparams();

}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawLayer1(loadedImageCount) {
    squares = [];

    for (let i = loadedImageCount; i < loadedImageCount + 10 && i < songList.length; i++) {
        let coords = getRandomCoords();
        let image = new Image();
        image.src = songList[i];

        await new Promise(resolve => {
            image.onload = function () {
                let aspectRatio = image.width / image.height;
                let imgWidth = Math.min(getImageSide(), getImageSide() * aspectRatio);
                let imgHeight = Math.min(getImageSide(), getImageSide() / aspectRatio);

                let coords = getRandomCoords(imgWidth, imgHeight);

                ctx.drawImage(image, coords[0], coords[1], imgWidth, imgHeight);

                squares.push({
                    x: coords[0],
                    y: coords[1],
                    width: imgWidth,
                    height: imgHeight
                });

                resolve();
            };

            image.onerror = function () {
                // Handle image loading error
                resolve();
            };
        });

        await sleep(10); // Introduce a small delay to prevent synchronous blocking
    }

    if (loadedImageCount + 10 < songList.length) {
        await sleep(1000); // Introduce a longer delay before the next batch
        await drawLayer1(loadedImageCount + 10);
    } else {
        const downloadButton = document.getElementById('downloadBtn');
        downloadButton.href = canvas.toDataURL();

        // Remove canvas from the DOM after drawing to it
        canvas.remove();

        // Create a new image element for displaying the result
        const resultImage = new Image();
        resultImage.src = downloadButton.href;

        // Adjust dimensions for half size
        resultImage.width = w / 2;
        resultImage.height = h / 2;

        // Append the image to the 'resultImage' div
        document.getElementById('resultImage').appendChild(resultImage);
    }
}

// Call drawLayer1 to initiate the process
drawLayer1(loadedImageCount);




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

