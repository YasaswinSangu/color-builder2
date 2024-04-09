let currentSwatch = null; 

document.getElementById('swatches-container').addEventListener('click', function(e) {
    // Ensure this is a left-click and not inside an existing swatch
    if (e.button === 0 && e.target === this) { // `0` is the button value for left-click
        const color = document.getElementById('colorPicker').value;
        const containerRect = this.getBoundingClientRect();
        let x = e.clientX - containerRect.left + this.scrollLeft;
        let y = e.clientY - containerRect.top + this.scrollTop;
        createSwatch(color, x, y, this);
    }
});

function createSwatch(color, x, y, container) {
    
    const swatch = document.createElement('div');
    swatch.classList.add('swatch');
    swatch.style.backgroundColor = color;
    swatch.style.position = 'absolute'; // Ensure this is set for positioning
    swatch.style.left = `${x}px`;
    swatch.style.top = `${y}px`;
    container.appendChild(swatch);
    makeDraggable(swatch, container);
    currentSwatch = swatch;
    // Add contextmenu event listener to each swatch for custom context menu
    swatch.addEventListener('contextmenu', function(event) {
      event.preventDefault(); // Prevent default context menu
      showContextMenu(event, this); // Pass the swatch element
  });
}

// Global variable to keep track of the current swatch

function showContextMenu(event, swatch) {
    currentSwatch = swatch; // Store the current swatch for later use
    const contextMenu = document.getElementById('context-menu');
    const offsetParentRect = swatch.offsetParent.getBoundingClientRect();
    const swatchRect = swatch.getBoundingClientRect();

    const topPosition = swatchRect.top - offsetParentRect.top + swatch.offsetHeight;
    const leftPosition = swatchRect.left - offsetParentRect.left;

    contextMenu.style.display = 'block';
    contextMenu.style.top = `${topPosition}px`;
    contextMenu.style.left = `${leftPosition}px`;

    event.preventDefault();
}

document.getElementById('change-color').addEventListener('click', function() {
  if (currentSwatch) {

    document.getElementById('colorPicker').click();
    hideContextMenu(); 
  }
});

// Corrected to include 'e' parameter in the function
document.getElementById('colorPicker').addEventListener('input', function(e) {
  if (currentSwatch) {
      currentSwatch.style.backgroundColor = e.target.value;
      // Here, add any logic to update the associated gradient if needed
      console.log("Color updated for selected swatch."); 
  } else {
      console.log("No swatch selected for color update."); 
  }
});


document.getElementById('delete-swatch').addEventListener('click', function() {
    if (currentSwatch) {
        currentSwatch.remove(); // Remove the swatch from the DOM
        hideContextMenu(); // Hide the context menu after deleting the swatch
    }
});

document.addEventListener('click', function(event) {
  // Hide the context menu if clicking outside a swatch or context menu
  if (!event.target.closest('.swatch') && !event.target.closest('#context-menu')) {
      hideContextMenu();
      //currentSwatch = null; // Consider resetting currentSwatch here if appropriate
  }
});

document.addEventListener('contextmenu', function(event) {
    // Prevent the default context menu globally unless it's on a swatch
    if (!event.target.classList.contains('swatch')) {
        event.preventDefault();
    }
});

function hideContextMenu() {
  const contextMenu = document.getElementById('context-menu');
  contextMenu.style.display = 'none';
  // Reset currentSwatch only if you want to clear the selection after each action
  // currentSwatch = null;
}

function makeDraggable(swatch, container) {
  let startPosX = 0, startPosY = 0, origX = 0, origY = 0;
  let isDragging = false;

  swatch.addEventListener('mousedown', function(e) {
      e.preventDefault();

      isDragging = true;
      startPosX = e.clientX;
      startPosY = e.clientY;
      origX = swatch.offsetLeft;
      origY = swatch.offsetTop;

      // Change the cursor to 'grabbing' to indicate dragging
      swatch.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;

      let newX = origX + e.clientX - startPosX;
      let newY = origY + e.clientY - startPosY;

      // Calculate the container's bounds
      const rect = container.getBoundingClientRect();

      // Constrain the swatch within the container's bounds
      if (newX < 0 || newY < 0 || newX + swatch.offsetWidth > rect.width || newY + swatch.offsetHeight > rect.height) {
          // If out of bounds, show a cross cursor
          swatch.style.cursor = 'not-allowed';
      } else {
          // If within bounds, update the position and show a grabbing cursor
          swatch.style.left = `${newX}px`;
          swatch.style.top = `${newY}px`;
          swatch.style.cursor = 'grabbing';
      }
  });

  document.addEventListener('mouseup', function() {
      if (isDragging) {
          isDragging = false;
          // Revert cursor to 'grab' after dragging is done
          swatch.style.cursor = 'grab';
          checkForTouchingSwatches(swatch);

      }
  });
}


function checkForTouchingSwatches(movedSwatch) {
  const swatches = document.querySelectorAll('.swatch');
  swatches.forEach(swatch => {
    if (swatch !== movedSwatch && isTouching(movedSwatch, swatch)) {
      // Create gradient between swatches
      createGradient(movedSwatch, swatch);
      drawGradient(movedSwatch,swatch);
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
  // Adjust this to show the gradient in the 'gradient-display' area
  const gradientDisplay = document.getElementById('gradient-display');
  gradientDisplay.style.background = `linear-gradient(${a.style.backgroundColor}, ${b.style.backgroundColor})`;
}

function drawGradient(a,b) {
  const canvas = document.getElementById('gradient-display');
  const ctx = canvas.getContext('2d');

  // Ensure the canvas size matches its display size for accurate color picking
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Create the gradient
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0); // Horizontal gradient
  gradient.addColorStop(0, a.style.backgroundColor); // Start color
  gradient.addColorStop(1, b.style.backgroundColor); // End color

  // Apply the gradient to the canvas
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Call drawGradient() to initially draw the gradient
window.addEventListener('load', drawGradient);


document.getElementById('gradient-display').addEventListener('click', function(e) {
  const canvas = this;
  const ctx = canvas.getContext('2d');

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;

  displaySelectedColor(color);
});


function displaySelectedColor(color) {
  const colorDisplay = document.getElementById('selected-color-display');
  colorDisplay.style.width = '100px'; // Adjust as needed
  colorDisplay.style.height = '50px'; // Adjust as needed
  colorDisplay.style.backgroundColor = color;
}


