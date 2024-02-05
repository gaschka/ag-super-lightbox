// TODO:
// Implement https://konvajs.org/docs/sandbox/Multi-touch_Scale_Stage.html
// Implement https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html#sidebar


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

// Open Lightbox
function openLightbox(fullSizeImgSrc) {
    img.src = '';
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
        const panSpeedMultiplier = 0.5;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const translateX = (x - centerX) * - panSpeedMultiplier;
        const translateY = (y - centerY) * - panSpeedMultiplier;
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.add('lightbox-closing');
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
    // Save the starting touch positions
    currentX = event.touches[0].clientX;
    currentY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    if (isTouchDevice) {
        const deltaX = touchX - currentX;
        const deltaY = touchY - currentY;

        accumulatedTranslateX += deltaX;
        accumulatedTranslateY += deltaY;

        img.style.transform = `translate(${accumulatedTranslateX}px, ${accumulatedTranslateY}px)`;
    }

    // Update current touch positions
    currentX = touchX;
    currentY = touchY;
}
