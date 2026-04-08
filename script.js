// ========== 3D ROTATING CUBE INTERACTION ==========
(function init3DCube() {
  const cube = document.getElementById('rotatingCube');
  if (!cube) return;
  
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let animationId = null;
  
  // Smooth animation for drag interaction
  function smoothRotate() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;
    
    cube.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    
    if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
      animationId = requestAnimationFrame(smoothRotate);
    } else {
      animationId = null;
    }
  }
  
  // Mouse/touch drag to control rotation
  const handleDragStart = (e) => {
    isDragging = true;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    startX = clientX;
    startY = clientY;
    cube.style.animation = 'none'; // Pause auto-rotation when dragging
    if (animationId) cancelAnimationFrame(animationId);
  };
  
  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    
    targetRotateY += deltaX * 0.5;
    targetRotateX -= deltaY * 0.5;
    
    startX = clientX;
    startY = clientY;
    
    if (!animationId) {
      animationId = requestAnimationFrame(smoothRotate);
    }
  };
  
  const handleDragEnd = () => {
    isDragging = false;
    // Resume auto-rotation after 2 seconds of no interaction
    setTimeout(() => {
      if (!isDragging && !animationId) {
        cube.style.animation = 'rotate3d-smooth 8s infinite linear';
        // Reset stored rotations when auto-rotating
        targetRotateX = 0;
        targetRotateY = 0;
        currentRotateX = 0;
        currentRotateY = 0;
      }
    }, 2000);
  };
  
  // Mouse events
  cube.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);
  
  // Touch events for mobile
  cube.addEventListener('touchstart', handleDragStart);
  window.addEventListener('touchmove', handleDragMove);
  window.addEventListener('touchend', handleDragEnd);
  
  // Click to show a fun message
  cube.addEventListener('click', () => {
    const messages = [
      "🌀 3D rotation — just like my multi-dimensional approach to code!",
      "🎨 Frontend meets backend — even my profile pic is full-stack!",
      "⚡ Spin it! Every face represents a different skill layer.",
      "💡 Did you know? I love 3D graphics and WebGL too!",
      "🚀 Keep spinning — just like my continuous deployment!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Show non-intrusive tooltip
    const tooltip = document.createElement('div');
    tooltip.textContent = randomMessage;
    tooltip.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #2c2e3a;
      color: #ffb347;
      padding: 10px 20px;
      border-radius: 40px;
      font-size: 0.85rem;
      font-weight: 500;
      z-index: 2000;
      animation: fadeOut 2s ease forwards;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // Add fade out animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        70% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); visibility: hidden; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  });
  
  // Keyboard accessibility
  cube.setAttribute('tabindex', '0');
  cube.setAttribute('role', 'button');
  cube.setAttribute('aria-label', '3D rotating cube - click for fun message, drag to rotate');
  
  cube.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cube.click();
    }
  });
})();
