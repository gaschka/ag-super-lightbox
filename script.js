// script.js

function displayLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex'; // Show the lightbox container
    setupPanningAndZooming(); // Setup panning and zooming functionality
}

function openLightbox(fullSizeImgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Clear any previous source to ensure the load event fires
    lightboxImg.src = '';

    // Add a load event listener to the image
    lightboxImg.onload = function() {
        // Once the image is loaded, display the lightbox
        lightbox.style.display = 'flex';
        setupPanningAndZooming();
    };

    // Set the source for the image, which triggers the load event
    lightboxImg.src = fullSizeImgSrc;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Add closing animation class
    lightbox.classList.add('lightbox-closing');

    // Wait for the animation to finish before hiding the lightbox
    lightbox.addEventListener('animationend', function() {
        lightbox.style.display = 'none';
        lightbox.classList.remove('lightbox-closing'); // Remove the class for next time
    }, { once: true });
}

// Global variables for current and target positions
let currentPosX = 50;
let currentPosY = 50;
let targetPosX = 50;
let targetPosY = 50;

function panImage(x, y, img) {
    const rect = img.getBoundingClientRect();
    targetPosX = (x - rect.left) / rect.width * 100;
    targetPosY = (y - rect.top) / rect.height * 100;

    // Call the function to smoothly update the position
    smoothUpdate(img);
}

function smoothUpdate(img) {
    // Calculate the difference between current and target positions
    const deltaX = targetPosX - currentPosX;
    const deltaY = targetPosY - currentPosY;

    // If the difference is significant, update the position
    if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        currentPosX += deltaX * 0.1; // Adjust the 0.1 for faster or slower transitions
        currentPosY += deltaY * 0.1;

        // Update the transform-origin property
        img.style.transformOrigin = `${currentPosX}% ${currentPosY}%`;

        // Continue the smooth update on the next animation frame
        requestAnimationFrame(() => smoothUpdate(img));
    }
}


function setupPanningAndZooming() {
    const img = document.getElementById('lightbox-img');
    currentPosX = 50;
    currentPosY = 50;
    img.style.transformOrigin = '50% 50%';

    // Zoom in the image
    img.style.transform = 'scale(2)'; // Adjust scale as needed

    // Pan the image on mouse move
    img.onmousemove = function(event) {
        panImage(event.clientX, event.clientY, img);
    };

    // Pan the image on touch move
    img.ontouchmove = function(event) {
        event.preventDefault();
        if (event.touches.length == 1) {
            const touch = event.touches[0];
            panImage(touch.clientX, touch.clientY, img);
        }
    };
}

