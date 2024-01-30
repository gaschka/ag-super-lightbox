// script.js

function displayLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex';
    setupPanningAndZooming();
}

function openLightbox(fullSizeImgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = '';

    lightboxImg.onload = function() {
        lightbox.style.display = 'flex';
        setTimeout(() => {
            panImage(currentMouseX, currentMouseY, lightboxImg);
        }, 1); // Delay of 1ms
    
        setupPanningAndZooming();
    };
    
    lightboxImg.src = fullSizeImgSrc;
}


function setupPanningAndZooming() {
    const img = document.getElementById('lightbox-img');
}

let currentMouseX = 0;
let currentMouseY = 0;
let img = document.getElementById('lightbox-img'); // Ensure this is the correct image element

document.onmousemove = function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;

    // Request to update the image position
    requestAnimationFrame(() => {
        // Call panImage only if the lightbox is visible
        if (document.getElementById('lightbox').style.display === 'flex') {
            panImage(currentMouseX, currentMouseY, img);
        }
    });
};


function updateDebugInfo(mouseX, mouseY, translateX, translateY) {
    const debugInfo = document.getElementById('debug-info');
    debugInfo.innerHTML = `Mouse X: ${mouseX.toFixed(2)}, Mouse Y: ${mouseY.toFixed(2)}, Translate X: ${translateX.toFixed(2)}px, Translate Y: ${translateY.toFixed(2)}px`;
}

function panImage(x, y, img) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const translateX = (x - centerX) * -1;
    const translateY = (y - centerY) * -1;


    const dampingFactor = 0.3; // Adjust this as needed, highter value is faster
    img.style.transform = `translate(${translateX * dampingFactor}px, ${translateY * dampingFactor}px)`;

    updateDebugInfo(x, y, translateX * dampingFactor, translateY * dampingFactor);
}



function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightbox.classList.add('lightbox-closing');

    lightbox.addEventListener('animationend', function() {
        lightbox.style.display = 'none';
        lightbox.classList.remove('lightbox-closing'); 
        lightboxImg.style.transform = 'translate(0px, 0px)';
        updateDebugInfo(0, 0, 0, 0);
    }, { once: true });
}

// Add touch event listeners to the lightbox
const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('touchstart', handleTouchStart, false);
lightbox.addEventListener('touchmove', handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;
let accumulatedTranslateX = 0;
let accumulatedTranslateY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    accumulatedTranslateX += deltaX;
    accumulatedTranslateY += deltaY;

    img.style.transform = `translate(${accumulatedTranslateX}px, ${accumulatedTranslateY}px`;

    // Update the initial touch coordinates for the next event
    touchStartX = touchX;
    touchStartY = touchY;
}


// Add touch event listener for double tap to close
img.addEventListener('touchend', handleTouchEnd, false);

let lastTapTime = 0;

function handleTouchEnd(event) {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    if (timeSinceLastTap < 300) { // Adjust the time threshold as needed
        // Double tap detected, close the lightbox
        closeLightbox();
    }

    lastTapTime = currentTime;
}




// Call setupPanningAndZooming to initialize
setupPanningAndZooming();



// Debug information element
const debugDiv = document.createElement('div');
debugDiv.id = 'debug-info';
debugDiv.style.position = 'fixed';
debugDiv.style.bottom = '10px';
debugDiv.style.left = '10px';
debugDiv.style.backgroundColor = 'white';
debugDiv.style.padding = '10px';
debugDiv.style.border = '1px solid black';
debugDiv.style.zIndex = '1000'; 
document.body.appendChild(debugDiv);
