// script.js


function displayLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex'; // Show the lightbox container
    setupPanningAndZooming(); // Setup panning and zooming functionality
}

function openLightbox(fullSizeImgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');


    lightboxImg.src = '';

    lightboxImg.onload = function() {
        lightbox.style.display = 'flex';
        // Delay panning to ensure the image is rendered
        setTimeout(() => {
            panImage(currentMouseX, currentMouseY, lightboxImg);
        }, 1); // Delay of 100ms, adjust as needed
    
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
function panImage(x, y, img) {
    const imgRect = img.getBoundingClientRect();
    const containerRect = document.body.getBoundingClientRect(); // or use a specific container

    // Damping factor to slow down the motion
    const dampingFactor = 0.5; // 5 times slower than the original speed

    // Calculate the amount to translate and invert the direction
    // Adjust coordinates to the container's coordinates
    const translateX = -((x - containerRect.left) - (imgRect.left + imgRect.width / 2)) * dampingFactor;
    const translateY = -((y - containerRect.top) - (imgRect.top + imgRect.height / 2)) * dampingFactor;

    // Apply the translation
    img.style.transform = `translate(${translateX}px, ${translateY}px)`;
}



function setupPanningAndZooming() {
    const img = document.getElementById('lightbox-img');

    document.onmousemove = function(event) {
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
