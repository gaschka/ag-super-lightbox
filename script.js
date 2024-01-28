// script.js

function openLightbox(fullSizeImgSrc) {
    document.getElementById('lightbox').style.display = 'flex'; // Changed to 'flex' to enable flexbox centering
    document.getElementById('lightbox-img').src = fullSizeImgSrc;
    setupPanningAndZooming();
}


function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
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
