/* ==========================================================================
   INTERACTIVE CANVAS: NODE NETWORK
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 65;
const connectionDistance = 120;
let mouse = { x: null, y: null, radius: 150 };

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 2 + 1.5;
    // Harmonious shades of green and cyan
    this.color = Math.random() > 0.5 ? '#1d9e75' : '#06b6d4';
  }

  update() {
    // Boundaries
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    // Movement
    this.x += this.vx;
    this.y += this.vy;

    // Mouse Interaction (subtle push/pull)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        // Gently attract particles toward mouse
        this.x += Math.cos(angle) * force * 0.8;
        this.y += Math.sin(angle) * force * 0.8;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and Update Particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw Connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < connectionDistance) {
        const alpha = (1 - distance / connectionDistance) * 0.15;
        ctx.strokeStyle = `rgba(29, 158, 117, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();

// Handle sizing changes gracefully
window.addEventListener('resize', () => {
  initParticles();
});


/* ==========================================================================
   TYPING ANIMATION EFFECT
   ========================================================================== */
const typewriterText = document.getElementById('typewriter');
const words = ["Predictive ML Models.", "Data Science Pipelines.", "Deep Learning Systems.", "Data-Driven Solutions."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;

function type() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typewriterText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 50;
  } else {
    typewriterText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 120;
  }

  // Word completely typed
  if (!isDeleting && charIndex === currentWord.length) {
    typeDelay = 2000; // Delay before starting to delete
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeDelay = 500; // Small pause before typing next word
  }

  setTimeout(type, typeDelay);
}

// Start Typing
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 1000);
});


/* ==========================================================================
   RESPONSIVE MOBILE NAVBAR
   ========================================================================== */
const navbarContainer = document.querySelector('.navbar-container');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinksList = document.querySelectorAll('.nav-links a');

// Toggle Drawer Menu
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = navToggle.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.setAttribute('data-lucide', 'x');
  } else {
    icon.setAttribute('data-lucide', 'menu');
  }
  lucide.createIcons();
});

// Close Menu on Link Click
navLinksList.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

// Navbar Scroll Styling
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbarContainer.classList.add('navbar-scrolled');
  } else {
    navbarContainer.classList.remove('navbar-scrolled');
  }
});


/* ==========================================================================
   SKILLS GRID FILTERING
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    skillCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});


/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
// Add reveal class to main sections dynamically
const sectionsToReveal = document.querySelectorAll(
  '.about-section, .stack-section, .projects-section, .sandbox-section, .timeline-section, .certifications-section, .contact-section'
);

sectionsToReveal.forEach(section => {
  section.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Stop observing after animated
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

sectionsToReveal.forEach(section => {
  revealObserver.observe(section);
});


/* ==========================================================================
   CONTACT FORM SUBMISSION (SIMULATION)
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Button Loading State
  const originalBtnContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Sending...</span> <i class="loader-spinner"></i>`;

  // Collect form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  // Simulate network request delay (1.5 seconds)
  setTimeout(() => {
    // Display feedback message
    formFeedback.textContent = `Thanks, ${formData.name}! Your message has been sent successfully.`;
    formFeedback.className = 'form-feedback success';
    
    // Reset Form
    contactForm.reset();
    
    // Reset Button State
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
    lucide.createIcons();

    // Clear feedback message after 5 seconds
    setTimeout(() => {
      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';
    }, 5000);

  }, 1500);
});

/* ==========================================================================
   ML SANDBOX CLASSIFIER SIMULATION
   ========================================================================== */
const glucoseInput = document.getElementById('glucose');
const bmiInput = document.getElementById('bmi');
const ageInput = document.getElementById('age');
const bpInput = document.getElementById('bp');

const valGlucose = document.getElementById('val-glucose');
const valBmi = document.getElementById('val-bmi');
const valAge = document.getElementById('val-age');
const valBp = document.getElementById('val-bp');

const runSandboxBtn = document.getElementById('run-sandbox-btn');
const gaugeFill = document.getElementById('gauge-fill');
const gaugePct = document.getElementById('gauge-pct');
const predictionAlert = document.getElementById('prediction-alert');
const alertTitle = document.getElementById('alert-title');
const alertDesc = document.getElementById('alert-desc');

if (glucoseInput) {
  // Update slider values dynamically
  glucoseInput.addEventListener('input', () => valGlucose.textContent = glucoseInput.value);
  bmiInput.addEventListener('input', () => valBmi.textContent = bmiInput.value);
  ageInput.addEventListener('input', () => valAge.textContent = ageInput.value);
  bpInput.addEventListener('input', () => valBp.textContent = bpInput.value);

  // Run prediction function
  function runPrediction() {
    const g = parseFloat(glucoseInput.value);
    const b = parseFloat(bmiInput.value);
    const a = parseFloat(ageInput.value);
    const bp = parseFloat(bpInput.value);

    // Logistic Regression Formula coefficients
    // z = beta_0 + beta_1*Glucose + beta_2*BMI + beta_3*Age + beta_4*BP
    const z = -5.2 + (0.027 * g) + (0.065 * b) + (0.015 * a) + (0.003 * bp);
    const probability = 1 / (1 + Math.exp(-z));
    const percent = Math.round(probability * 100);

    // Animate Gauge filling
    // Stroke-dasharray is 125.6 (representing the arc)
    const arcLength = 125.6;
    const strokeOffset = arcLength * (1 - probability);
    
    gaugeFill.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
    gaugeFill.style.strokeDashoffset = strokeOffset;

    // Counter animation for text percentage
    let count = 0;
    const currentPct = parseInt(gaugePct.textContent) || 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    function animateCount(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const easeProgress = progress * (2 - progress);
      const value = Math.round(currentPct + (percent - currentPct) * easeProgress);
      
      gaugePct.textContent = `${value}%`;

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        gaugePct.textContent = `${percent}%`;
      }
    }
    requestAnimationFrame(animateCount);

    // Update Prediction Alert Message
    setTimeout(() => {
      predictionAlert.className = 'prediction-alert'; // reset
      const icon = predictionAlert.querySelector('.alert-icon i');

      if (probability >= 0.5) {
        predictionAlert.classList.add('danger');
        alertTitle.textContent = `High Risk Classified (P = ${probability.toFixed(3)})`;
        alertDesc.textContent = `Based on model weights, parameters cross the decision boundary. High diabetes likelihood.`;
        icon.setAttribute('data-lucide', 'alert-triangle');
      } else {
        predictionAlert.classList.add('safe');
        alertTitle.textContent = `Low Risk Classified (P = ${probability.toFixed(3)})`;
        alertDesc.textContent = `Model outputs normal ranges. Probability lies below decision threshold.`;
        icon.setAttribute('data-lucide', 'check-circle-2');
      }
      lucide.createIcons();
    }, 300);
  }

  runSandboxBtn.addEventListener('click', runPrediction);
}


/* ==========================================================================
   PROJECT DETAILS MODALS
   ========================================================================== */
const openModalButtons = document.querySelectorAll('.open-modal-btn');
const closeModalButtons = document.querySelectorAll('.modal-close');
const modalBackdrops = document.querySelectorAll('.modal-backdrop');

// Open Modal
openModalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const project = btn.getAttribute('data-project');
    const modal = document.getElementById(`modal-${project}`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    }
  });
});

// Close Modal functions
function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Re-enable page scrolling
}

closeModalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const project = btn.getAttribute('data-close');
    const modal = document.getElementById(`modal-${project}`);
    if (modal) {
      closeModal(modal);
    }
  });
});

// Close when clicking outside of modal card
modalBackdrops.forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop);
    }
  });
});

