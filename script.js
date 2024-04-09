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

    // Add contextmenu event listener to each swatch for custom context menu
    swatch.addEventListener('contextmenu', function(event) {
      event.preventDefault(); // Prevent default context menu
      showContextMenu(event, swatch); // Pass the swatch element
  });
}

let currentSwatch = null; // Global variable to keep track of the current swatch

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
      // Simulate a click on the color picker
      document.getElementById('colorPicker').click();
      hideContextMenu(); // Hide the context menu
  }
});

document.getElementById('colorPicker').addEventListener('input', function(e) {
  if (currentSwatch) {
      // Update the current swatch's color with the selected color
      currentSwatch.style.backgroundColor = e.target.value;
  }
});

document.getElementById('delete-swatch').addEventListener('click', function() {
    if (currentSwatch) {
        currentSwatch.remove(); // Remove the swatch from the DOM
        hideContextMenu(); // Hide the context menu after deleting the swatch
    }
});


document.addEventListener('click', function(event) {
    // Hide the context menu if clicking outside a swatch
    if (!event.target.classList.contains('swatch') && !event.target.closest('#context-menu')) {
      hideContextMenu();
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
  currentSwatch = null; // Reset currentSwatch when the context menu is hidden
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

