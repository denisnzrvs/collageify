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
        image.crossOrigin = "anonymous"; // Helps with CORS issues
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
                console.error("Failed to load image:", songList[i]);
                resolve();
            };
        });

        await sleep(10);
    }

    if (loadedImageCount + 10 < songList.length) {
        await sleep(1000);
        await drawLayer1(loadedImageCount + 10);
    } else {
        console.log("Finished drawing, preparing download...");

        // Convert canvas to Blob and trigger download
        canvas.toBlob(blob => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const downloadButton = document.getElementById('downloadBtn');
                
                // Ensure download button is properly set up
                downloadButton.href = url;
                downloadButton.download = 'collage.png';

                // Force the button to be clickable
                downloadButton.style.display = "inline-block";

                // Ensure clicking actually downloads
                downloadButton.onclick = function () {
                    const tempLink = document.createElement("a");
                    tempLink.href = url;
                    tempLink.download = "collage.png";
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(url); // Cleanup
                };
            } else {
                console.error("Failed to create Blob from canvas");
            }
        });

        // Remove canvas from the DOM
        canvas.remove();

        // Create a new image element for displaying the result
        const resultImage = new Image();
        resultImage.src = canvas.toDataURL(); // Still used for preview
        resultImage.width = w / 2;
        resultImage.height = h / 2;
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
    let attempts = 0; // Limit attempts to prevent infinite loop
    let maxAttempts = 3;
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

        attempts++;
        if (attempts >= maxAttempts) {
            console.warn("Max attempts reached, placing image without checking overlap");
            break; // Stop checking and return the last position
        }
    } while (overlap);

    return [x, y];
}

