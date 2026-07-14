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


