// Navbar & Scroll Progress Bar
window.addEventListener('scroll', () => {
    // Progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }

    // Navbar effect
    const navbar = document.querySelector('.navbar');
    if (winScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// ===========================
// ACTIVE NAV LINK HIGHLIGHTING
// ===========================
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-links li a');

function setActiveNav(id) {
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
        }
    });
}

// Close mobile menu when a link is clicked and set active
navItems.forEach(link => {
    link.addEventListener('click', function(e) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        const id = this.getAttribute('href').substring(1);
        setActiveNav(id);
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px'
});

sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
});

// Add some simple animation to project cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .project-card-side, .skill-category, .stat-item').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ===========================
// IMAGE MODAL LOGIC
// ===========================
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close-modal');

if (modal && modalImg && closeBtn) {
    document.querySelectorAll('.project-image-side, .project-image').forEach(imgContainer => {
        imgContainer.style.cursor = 'zoom-in';
        imgContainer.addEventListener('click', () => {
            const bg = window.getComputedStyle(imgContainer).backgroundImage;
            if (bg && bg !== 'none') {
                // Extract URL from url("path/to/image.jpg")
                const url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                modalImg.src = url;
                modal.classList.add('show');
            }
        });
    });

    document.querySelectorAll('.studyai-img').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('show');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target !== modalImg) {
            modal.classList.remove('show');
        }
    });
}

// ===========================
// LOADER & MICRO-INTERACTIONS
// ===========================
const hideLoader = () => {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none') {
        loader.classList.add('hide-loader');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hideLoader();
} else {
    window.addEventListener('DOMContentLoaded', hideLoader);
    window.addEventListener('load', hideLoader);
}

// Failsafe: always hide loader after 2.5 seconds regardless of network issues
setTimeout(hideLoader, 2500);

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create span element
        let ripples = document.createElement('span');
        
        // Calculate position
        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;
        
        // Set position and add class
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        
        // Append to button
        this.appendChild(ripples);
        
        // Remove after animation completes
        setTimeout(() => {
            ripples.remove();
        }, 600);
    });
});

// ===========================
// CONTACT MODAL & SUBMISSION
// ===========================
const contactModal = document.getElementById('contact-modal');
const openContactBtn = document.getElementById('open-contact-modal');
const closeContactBtn = document.querySelector('.close-contact-modal');
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn        = document.getElementById('submit-btn');
        const btnText    = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        const successMsg = document.getElementById('form-success');
        const errorMsg   = document.getElementById('form-error');

        // Reset previous feedback
        if(successMsg) successMsg.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'none';

        // Show loading state
        if (btnText && btnLoading) {
            btnText.style.display    = 'none';
            btnLoading.style.display = 'flex';
        }
        if(btn) btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch("https://formspree.io/f/xeeyooaq", {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if(successMsg) successMsg.style.display = 'flex';
                contactForm.reset();
                setTimeout(() => {
                    if(successMsg) successMsg.style.display = 'none';
                    contactModal.style.opacity = '0';
                    setTimeout(() => { contactModal.style.display = 'none'; }, 300);
                }, 2500);
            } else {
                if(errorMsg) errorMsg.style.display = 'flex';
            }
        } catch (err) {
            console.error("Form submission failed", err);
            if(errorMsg) errorMsg.style.display = 'flex';
        } finally {
            if (btnText && btnLoading) {
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
            }
            if(btn) btn.disabled = false;
        }
    });
}

if (contactModal && openContactBtn && closeContactBtn) {
    // Open Modal
    openContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.style.display = 'flex';
        setTimeout(() => { contactModal.style.opacity = '1'; }, 10);
    });

    // Close Modal via X button
    closeContactBtn.addEventListener('click', () => {
        contactModal.style.opacity = '0';
        setTimeout(() => { contactModal.style.display = 'none'; }, 300);
    });

    // Close Modal via background click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.opacity = '0';
            setTimeout(() => { contactModal.style.display = 'none'; }, 300);
        }
    });
}

// ===========================
// THEME TOGGLE LOGIC
// ===========================
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark' || !theme) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggleBtn.style.transform = 'rotate(180deg)';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggleBtn.style.transform = 'rotate(0deg)';
        }
    });
}

// ===========================
// BACK TO TOP BUTTON
// ===========================
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================
// INSANE EFFECTS LOGIC
// ===========================

// Global mouse tracking
let globalMouseX = window.innerWidth / 2;
let globalMouseY = window.innerHeight / 2;

// Detect touch/mobile device — disable JS-driven transforms on touch screens
const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// 1. Custom Fluid Cursor
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower) {
    let followerX = window.innerWidth / 2;
    let followerY = window.innerHeight / 2;
    
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
        globalMouseX = e.clientX;
        globalMouseY = e.clientY;
        cursor.style.left = globalMouseX + 'px';
        cursor.style.top = globalMouseY + 'px';

        // Cursor Trail Effect
        const now = Date.now();
        if (now - lastTrailTime > 25) { // Limit trail frequency
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.left = globalMouseX + 'px';
            dot.style.top = globalMouseY + 'px';
            document.body.appendChild(dot);
            
            requestAnimationFrame(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0.1) translate(-50%, -50%)';
            });
            
            setTimeout(() => dot.remove(), 400);
            lastTrailTime = now;
        }

        // Hero 3D Parallax Tracking — skip on touch devices to allow normal scroll
        if (!isTouchDevice()) {
            const heroContent = document.querySelector('.hero-content');
            const heroImage = document.querySelector('.hero-image-wrapper');
            const parallaxX = (window.innerWidth / 2 - globalMouseX) / 40;
            const parallaxY = (window.innerHeight / 2 - globalMouseY) / 40;
            
            if (heroContent) heroContent.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
            if (heroImage) heroImage.style.transform = `translate(${-parallaxX}px, ${-parallaxY}px)`;
        }
    });

    // Cursor Follower Scroll Progress Ring
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.max(0.1, (winScroll / height) * 100);
        
        if (cursorFollower && !cursorFollower.classList.contains('hover-active')) {
            cursorFollower.style.background = `conic-gradient(var(--accent) ${scrolled}%, rgba(59, 130, 246, 0.05) ${scrolled}%)`;
        }
    });

    // Easing function for follower
    function loop() {
        followerX += (globalMouseX - followerX) * 0.2;
        followerY += (globalMouseY - followerY) * 0.2;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(loop);
    }
    loop();

    // Hover effect
    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card, .skill-category, .contact-card, .service-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover-active'));
    });
}

// 2. Spotlight "Glow" Effect on Cards
const glowCards = document.querySelectorAll('.project-card, .project-card-side, .skill-category, .service-card, .contact-card');
glowCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 3. Magnetic Buttons — disabled on touch devices (they don't have hover/mousemove)
const magneticBtns = document.querySelectorAll('.magnetic-btn');
if (!isTouchDevice()) {
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

// 4. Decoder Text Reveal
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;
    
    const startGlitch = () => {
        let iteration = 0;
        clearInterval(interval);
        const originalText = glitchText.dataset.value || glitchText.innerText;
        
        interval = setInterval(() => {
            glitchText.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iteration) return originalText[index];
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
            
            if(iteration >= originalText.length){ 
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);
    };

    // Trigger on load
    setTimeout(startGlitch, 500);
}

// 5. Interactive Canvas Particles
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
        for(let i=0; i<numParticles; i++) {
            particles.push(new Particle());
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.baseRadius = this.radius;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if(this.x < 0 || this.x > width) this.vx = -this.vx;
            if(this.y < 0 || this.y > height) this.vy = -this.vy;

            // Mouse interaction
            const dx = globalMouseX - this.x;
            const dy = globalMouseY - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
                this.radius = this.baseRadius * 2;
            } else {
                this.radius = this.baseRadius;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Color particles based on proximity to mouse — glowing blue/purple near cursor
            const dx = globalMouseX - this.x;
            const dy = globalMouseY - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (dist < 180) {
                ctx.fillStyle = `rgba(139, 92, 246, ${1 - dist/180})`;
            } else {
                ctx.fillStyle = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
            }
            ctx.fill();
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        for(let i=0; i<particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for(let j=i+1; j<particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 130) {
                    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                    const alpha = 0.08 - dist/1625;
                    // Lines glow purple/blue near cursor
                    const mx = (particles[i].x + particles[j].x) / 2;
                    const my = (particles[i].y + particles[j].y) / 2;
                    const cdx = globalMouseX - mx;
                    const cdy = globalMouseY - my;
                    const cdist = Math.sqrt(cdx*cdx + cdy*cdy);
                    if (cdist < 200) {
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 4})`;
                    } else {
                        ctx.strokeStyle = isLight ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
                    }
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();
}




// 7. SECTION ENTRANCE — 3D TILT REVEAL
const sectionHeaders = document.querySelectorAll('.section-title');
const sectionGlitchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.offsetHeight;
            entry.target.style.animation = '';
            entry.target.classList.add('glitch-anim');
            sectionGlitchObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

sectionHeaders.forEach(el => sectionGlitchObserver.observe(el));

// 8. NEON GLOW PULSE ON SKILL TAGS
const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
skillTags.forEach((tag, i) => {
    tag.style.animationDelay = `${(i * 0.15) % 3}s`;
    tag.addEventListener('mouseenter', () => {
        const colors = ['#a855f7','#3b82f6','#06b6d4','#f59e0b','#ec4899'];
        const c = colors[Math.floor(Math.random() * colors.length)];
        tag.style.boxShadow = `0 0 12px ${c}, 0 0 24px ${c}55`;
        tag.style.borderColor = c;
        tag.style.color = c;
        tag.style.transition = 'box-shadow 0.3s, border-color 0.3s, color 0.3s';
    });
    tag.addEventListener('mouseleave', () => {
        tag.style.boxShadow = '';
        tag.style.borderColor = '';
        tag.style.color = '';
    });
});

// 9. SCROLL-REACTIVE BLOB COLORS
const blobs = document.querySelectorAll('.blob');
window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const hue1 = Math.round(220 + progress * 140); // blue -> pink
    const hue2 = Math.round(270 + progress * 90);  // purple -> orange
    if (blobs[0]) blobs[0].style.background = `hsla(${hue1}, 80%, 60%, 0.3)`;
    if (blobs[1]) blobs[1].style.background = `hsla(${hue2}, 70%, 60%, 0.25)`;
    if (blobs[2]) blobs[2].style.background = `hsla(${(hue1+hue2)/2}, 75%, 65%, 0.25)`;
});

// 10. TYPING ANIMATION ON SUBTITLE
const subtitle = document.querySelector('.hero p.subtitle');
if (subtitle) {
    // Use textContent only — slicing raw innerHTML breaks HTML tags and hangs the page
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    let i = 0;
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            subtitle.textContent = text.substring(0, i);
            i++;
            if (i > text.length) {
                clearInterval(typeInterval);
                subtitle.textContent = text;
            }
        }, 22);
    }, 1200); // Start after loader fades out
}
