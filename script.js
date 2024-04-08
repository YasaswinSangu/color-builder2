document.getElementById('colorPicker').addEventListener('change', function() {
  createSwatch(this.value);
});

function createSwatch(color) {
  const swatch = document.createElement('div');
  swatch.classList.add('swatch');
  swatch.style.backgroundColor = color;
  swatch.style.top = `${Math.random() * 350}px`; // Random initial position
  swatch.style.left = `${Math.random() * (document.getElementById('playground').clientWidth - 50)}px`;
  document.getElementById('playground').appendChild(swatch);
  makeDraggable(swatch);
}

function makeDraggable(elem) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elem.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position:
    elem.style.top = (elem.offsetTop - pos2) + "px";
    elem.style.left = (elem.offsetLeft - pos1) + "px";
    checkForTouchingSwatches(elem);
  }

  function closeDragElement() {
    // Stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function checkForTouchingSwatches(movedSwatch) {
  const swatches = document.querySelectorAll('.swatch');
  swatches.forEach(swatch => {
    if (swatch !== movedSwatch && isTouching(movedSwatch, swatch)) {
      // Create gradient between swatches
      createGradient(movedSwatch, swatch);
    }
  });
}

function isTouching(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  // Simple collision detection
  return !(aRect.right < bRect.left || 
           aRect.left > bRect.right || 
           aRect.bottom < bRect.top || 
           aRect.top > bRect.bottom);
}

function createGradient(a, b) {
  // This is a placeholder for gradient creation logic.
  // You will need to customize this function based on how you want to visualize the gradient effect.
  console.log('Create gradient between', a.style.backgroundColor, 'and', b.style.backgroundColor);
  // Example: Update playground background with gradient
  document.getElementById('playground').style.background = `linear-gradient(${a.style.backgroundColor}, ${b.style.backgroundColor})`;
}
