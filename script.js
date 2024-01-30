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

document.onmousemove = function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;

    // Call panImage only if the lightbox is visible
    if (document.getElementById('lightbox').style.display === 'flex') {
        panImage(currentMouseX, currentMouseY, document.getElementById('lightbox-img'));
    }
};


function updateDebugInfo(mouseX, mouseY, translateX, translateY) {
    const debugInfo = document.getElementById('debug-info');
    debugInfo.innerHTML = `Mouse X: ${mouseX.toFixed(2)}, Mouse Y: ${mouseY.toFixed(2)}, Translate X: ${translateX.toFixed(2)}px, Translate Y: ${translateY.toFixed(2)}px`;
}

function panImage(x, y, img) {
    // Use the natural size of the image
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Assuming the image is placed directly within the body or a similarly sized container
    const containerRect = document.body.getBoundingClientRect();

    // Calculate the amount to translate and invert the direction
    const translateX = -((x - containerRect.left) - (naturalWidth / 2));
    const translateY = -((y - containerRect.top) - (naturalHeight / 2));

    // Apply the damping factor if needed
    const dampingFactor = 0.7; // Adjust this as needed
    img.style.transform = `translate(${translateX * dampingFactor}px, ${translateY * dampingFactor}px)`;

    // Update debug information if you have this function implemented
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
