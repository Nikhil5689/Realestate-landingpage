document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
        });
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
           const isClickInsideNav = mainNav.contains(event.target);
           const isClickOnToggle = menuToggle.contains(event.target);
           if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
               mainNav.classList.remove('open');
               menuToggle.classList.remove('open');
               menuToggle.setAttribute('aria-expanded', 'false');
           }
       });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Do nothing for placeholder links
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let headerOffset = 75; // Adjusted header height
                if (window.innerWidth <= 768) { headerOffset = 65; }
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                if (targetId === '#home') { offsetPosition = 0; }
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                // Close mobile nav if open
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    if(menuToggle) {
                        menuToggle.classList.remove('open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) { return; } 
            else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });

    // --- Hero Slider ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideInterval;

    function showHeroSlide(index) {
        if (slides.length === 0) return; // Exit if no slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function nextHeroSlide() {
        if (slides.length === 0) return;
        currentSlide = (currentSlide + 1) % slides.length;
        showHeroSlide(currentSlide);
    }

    function startHeroSlider() {
        stopHeroSlider(); // Clear existing interval
        if (slides.length > 0) {
            showHeroSlide(currentSlide); // Show initial slide
        }
        slideInterval = setInterval(nextHeroSlide, 5000); // Change every 5 seconds
    }

    function stopHeroSlider() {
        clearInterval(slideInterval);
    }

    if (slides.length > 1) {
        startHeroSlider();
    } else if (slides.length === 1) {
         showHeroSlide(0); // Show the single slide if only one exists
    }


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    
    // --- Contact Form Mock Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Main form submitted (mock).');
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitted!';
            submitButton.disabled = true;
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 this.reset();
            }, 3000);
        });
    }

    // --- Contact Popup Modal Logic (NEW) ---
    const openBtn = document.getElementById('openContactPopup');
    const closeBtn = document.getElementById('closeContactPopup');
    const overlay = document.getElementById('contactPopupOverlay');
    const popup = document.getElementById('contactPopup');
    const popupForm = document.getElementById('popupContactForm');
    const formContent = document.getElementById('popupFormContent');
    const thankYouMessage = document.getElementById('popupThankYouMessage');

    if (openBtn && closeBtn && overlay && popup && popupForm && formContent && thankYouMessage) {
        
        const openPopup = () => {
            overlay.classList.add('visible');
            popup.classList.add('visible');
            // Ensure form is visible and thank you is hidden
            formContent.style.display = 'block';
            thankYouMessage.style.display = 'none';
        };

        const closePopup = () => {
            overlay.classList.remove('visible');
            popup.classList.remove('visible');
            // Reset form after transition
            setTimeout(() => {
                popupForm.reset();
                // Ensure form is visible again for next time
                formContent.style.display = 'block';
                thankYouMessage.style.display = 'none';
            }, 300); // Match CSS transition duration
        };

        openBtn.addEventListener('click', openPopup);
        closeBtn.addEventListener('click', closePopup);
        
        // Close by clicking outside the popup
        overlay.addEventListener('click', (e) => {
            // Check if the click is directly on the overlay
            if (e.target === overlay) {
                closePopup();
            }
        });

        // Handle popup form submission
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide form, show thank you
            formContent.style.display = 'none';
            thankYouMessage.style.display = 'block';
            console.log('Popup form submitted (mock).');

            // Automatically close popup after 3 seconds
            setTimeout(() => {
                closePopup();
            }, 3000);
        });
    } else {
        console.warn('Popup modal elements not found. Sticky contact button may not work.');
    }

});

