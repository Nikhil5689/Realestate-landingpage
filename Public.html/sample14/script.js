document.addEventListener('DOMContentLoaded', function() {
    const topNav = document.getElementById('topNav');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    let headerHeight = 75; // Initial default

    // --- Adjust Header & Body Padding ---
    function updateHeaderLayout() {
        if (topNav) {
            headerHeight = topNav.offsetHeight;
            body.style.paddingTop = headerHeight + 'px';
        }
    }
    updateHeaderLayout(); // Initial check
    window.addEventListener('resize', updateHeaderLayout);

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
        updateHeaderLayout(); // Update height as padding changes
    });

    // --- Mobile Menu Toggle ---
    if (menuToggle && mainNav) {
         const navLinksContainer = mainNav.querySelector('.nav-links'); // Get ul
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : ''; // Prevent body scroll
             if (navLinksContainer) { // Check if navLinksContainer exists
                navLinksContainer.style.display = isOpen ? 'flex' : 'none';
             }
        });

        // Close menu when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = ''; // Re-enable scroll
                if (navLinksContainer) { // Check if navLinksContainer exists
                    navLinksContainer.style.display = 'none'; // Hide links immediately
                }
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let elementPosition = targetElement.getBoundingClientRect().top;
                // Use the dynamically updated headerHeight
                let offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                // Special case for #home to scroll to top
                if (targetId === '#home') { offsetPosition = 0; }

                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                // Close mobile nav if open
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = ''; // Re-enable scroll
                     const navLinksContainer = mainNav.querySelector('.nav-links');
                     if (navLinksContainer) { // Check if navLinksContainer exists
                        navLinksContainer.style.display = 'none'; // Hide links immediately
                     }
                }
            }
        });
    });

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) { 
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    
    // --- Contact Form Mock Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
             const submitButton = this.querySelector('button[type="submit"]');
             if(submitButton.disabled) return; // Prevent multiple clicks

            console.log('Form submitted (mock).');
            submitButton.textContent = 'Registered!';
            submitButton.disabled = true;
            setTimeout(() => {
                 submitButton.textContent = 'Register Interest';
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

