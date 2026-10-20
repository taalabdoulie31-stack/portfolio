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
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hide-loader');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Wait for transition to finish
    }
});

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
