// Detect if the device is touch-capable
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Get DOM elements
const lightbox = document.getElementById('lightbox');
const img = document.getElementById('lightbox-img'); 

// Variables for tracking positions
let currentX = 0;
let currentY = 0;
let accumulatedTranslateX = 0;
let accumulatedTranslateY = 0;
let initialDistance = null;
let initialMidpoint = null;
let currentScale = 1; 


// Open Lightbox
function openLightbox(fullSizeImgSrc) {
    img.src = '';

    currentScale = 1; 

    img.onload = function() {
        lightbox.style.display = 'flex';

        if (isTouchDevice) {
            // For touch devices, ensure it starts centered
            img.style.transform = 'translate(0px, 0px)';
            accumulatedTranslateX = 0;
            accumulatedTranslateY = 0;
        } else {
            // For non-touch devices, set transform based on current mouse position
            panImage(currentX, currentY);
        }
    };
    img.src = fullSizeImgSrc;
}

// Pan Image
function panImage(x, y) {
    if (!isTouchDevice) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const translateX = (x - centerX) * -0.3;
        const translateY = (y - centerY) * -0.3;
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.add('lightbox-closing');
    accumulatedTranslateX = 0;
    accumulatedTranslateY = 0;
    currentScale = 1;
    lightbox.addEventListener('animationend', () => {
        lightbox.style.display = 'none';
        lightbox.classList.remove('lightbox-closing'); 
        img.style.transform = 'translate(0px, 0px)';
        // Reset position variables
        accumulatedTranslateX = 0;
        accumulatedTranslateY = 0;
    }, { once: true });
}

// Mouse and Touch Event Handlers
document.onmousemove = (event) => {
    if (!isTouchDevice) {
        currentX = event.clientX;
        currentY = event.clientY;
        if (lightbox.style.display === 'flex') {
            panImage(currentX, currentY);
        }
    }
};

lightbox.addEventListener('touchstart', handleTouchStart, false);
lightbox.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    if (event.touches.length === 1) {
        // Single finger touch: Initialize panning
        currentX = event.touches[0].clientX;
        currentY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // Two finger touch: Initialize zooming
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialMidpoint = getMidpoint(event.touches[0], event.touches[1]);
    }
}

function handleTouchMove(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
        if (initialDistance !== null) {
            // Transition from two-finger to one-finger gesture
            currentX = event.touches[0].clientX;
            currentY = event.touches[0].clientY;
            initialDistance = null;
            initialMidpoint = null;
        } else {
            // Single finger touch: Pan
            const deltaX = event.touches[0].clientX - currentX;
            const deltaY = event.touches[0].clientY - currentY;

            accumulatedTranslateX += deltaX;
            accumulatedTranslateY += deltaY;

            img.style.transform = `translate(${accumulatedTranslateX}px, ${accumulatedTranslateY}px) scale(${currentScale})`;

            currentX = event.touches[0].clientX;
            currentY = event.touches[0].clientY;
        }
    } else if (event.touches.length === 2) {
        // Two fingers touch: Zoom and Pan
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        // Calculate current distance for zoom
        const currentDistance = getDistance(touch1, touch2);
        const scale = currentDistance / initialDistance;

        // Calculate the current midpoint for pan
        const currentMidpoint = getMidpoint(touch1, touch2);
        const deltaX = (currentMidpoint.x - initialMidpoint.x) * scale;
        const deltaY = (currentMidpoint.y - initialMidpoint.y) * scale;

        // Apply scale and translation
        img.style.transform = `translate(${(accumulatedTranslateX + deltaX)}px, ${(accumulatedTranslateY + deltaY)}px) scale(${scale})`;

        currentScale = scale; // Update the current scale
    }
}


function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getMidpoint(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}