// script.js


function displayLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex'; // Show the lightbox container
    setupPanningAndZooming(); // Setup panning and zooming functionality
}

function openLightbox(fullSizeImgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Set initial scale right away
    lightboxImg.style.transform = 'scale(1.6)'; // Adjust this scale as needed

    lightboxImg.src = '';

    lightboxImg.onload = function() {
        // Delay panning to ensure the image is rendered
        setTimeout(() => {
            panImage(currentMouseX, currentMouseY, lightboxImg);
        }, 1); // Delay of 100ms, adjust as needed
    
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

        // Reset the position and scale of the image
        lightboxImg.style.transformOrigin = '50% 50%';
        lightboxImg.style.transform = 'scale(1.6)';
    }, { once: true });
}


function panImage(x, y, img) {
    const rect = img.getBoundingClientRect();
    const posX = ((x - rect.left) / rect.width) * 100;
    const posY = ((y - rect.top) / rect.height) * 100;

    // Update the transform-origin property based on the mouse position
    img.style.transformOrigin = `${posX}% ${posY}%`;
}

function setupPanningAndZooming() {
    const img = document.getElementById('lightbox-img');

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

let currentMouseX = 0;
let currentMouseY = 0;

document.onmousemove = function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
};
