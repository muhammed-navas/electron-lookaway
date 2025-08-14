// Overlay countdown functionality
let currentRemaining = 0;
let currentTotal = 0;

// Listen for countdown updates from the main process
window.overlayAPI.onCountdownUpdate((data) => {
  updateCountdown(data.remaining, data.total);
});

function updateCountdown(remaining, total) {
  currentRemaining = remaining;
  currentTotal = total;
  
  // Update time display
  const timeDisplay = document.getElementById('time-display');
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update progress ring
  updateProgressRing(remaining, total);
  
  // Add pulse animation for low time
  const overlay = document.getElementById('overlay');
  if (remaining <= 10) {
    overlay.classList.add('pulse');
  } else {
    overlay.classList.remove('pulse');
  }
}

function updateProgressRing(remaining, total) {
  const circle = document.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 90; // r = 90
  
  // Calculate progress (0 to 1)
  const progress = remaining / total;
  
  // Calculate stroke-dashoffset
  const offset = circumference - (progress * circumference);
  
  // Update the circle
  circle.style.strokeDashoffset = offset;
} 