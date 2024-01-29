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


function setupPanningAndZooming() {
    const img = document.getElementById('lightbox-img');
    // Zoom in the image
    img.style.transform = 'scale(2)'; // Adjust scale as needed

    // Pan the image on mouse move
    img.onmousemove = function(event) {
        panImage(event.clientX, event.clientY, img);
    };

    // Pan the image on touch move
    img.ontouchmove = function(event) {
        // Prevent default touch behavior
        event.preventDefault();
        if (event.touches.length == 1) {
            const touch = event.touches[0];
            panImage(touch.clientX, touch.clientY, img);
        }
    };
}

function panImage(x, y, img) {
    const rect = img.getBoundingClientRect();
    const posX = (x - rect.left) / rect.width;
    const posY = (y - rect.top) / rect.height;
    img.style.transformOrigin = `${posX * 100}% ${posY * 100}%`;
}
