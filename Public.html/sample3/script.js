document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    const body = document.body;

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            // Prevent body scrolling when mobile nav is open
            body.style.overflow = isOpen ? 'hidden' : '';
        });
    }
    
    // Close mobile nav when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = ''; // Re-enable scrolling
        });
    });


    // --- Smooth Scroll for All Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let headerOffset = 0;
                // Check if mobile header is active (matches @media max-width: 1200px)
                if (window.innerWidth <= 1200) {
                    headerOffset = 70; // From :root --top-header-height
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    // --- Active Nav Link on Scroll (Scroll-Spy) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav-links a');

    // Only run observer if desktop nav exists and is visible
    if (navLinks.length > 0 && window.innerWidth > 1200) {
        const observerOptions = {
            root: null,
            rootMargin: "-30% 0px -60% 0px", // Triggers when section is in the middle 40% of viewport
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.sidebar-nav-links a[href="#${id}"]`);
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const faderOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const faderObserver = new IntersectionObserver(function(
        entries,
        faderObserver
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                faderObserver.unobserve(entry.target);
            }
        });
    }, faderOptions);

    faders.forEach(fader => {
        faderObserver.observe(fader);
    });
    
    
    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- NEW: Sticky Popup Form Logic ---
    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupFormContainer = document.getElementById('popupFormContainer');
    const popupContactForm = document.getElementById('popupContactForm');

    if (openPopupBtn && closePopupBtn && popupOverlay && popupContactForm) {
        // Open popup
        openPopupBtn.addEventListener('click', () => {
            popupOverlay.classList.add('open');
        });

        // Close popup via 'X' button
        closePopupBtn.addEventListener('click', () => {
            popupOverlay.classList.remove('open');
            // Reset form if it was submitted
            if (popupFormContainer.classList.contains('submitted')) {
                setTimeout(() => {
                    popupFormContainer.classList.remove('submitted');
                    popupContactForm.reset();
                }, 300); // Wait for fade-out
            }
        });

        // Close popup by clicking overlay
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                closePopupBtn.click(); // Trigger close logic
            }
        });

        // Handle popup form submission
        popupContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show thank you message
            popupFormContainer.classList.add('submitted');

            // Automatically close popup after 3 seconds
            setTimeout(() => {
                closePopupBtn.click();
            }, 3000);
        });
    }

    // --- NEW: Main Contact Form Submission Logic ---
    const mainContactForm = document.getElementById('mainContactForm');
    const mainContactSuccess = document.getElementById('main-contact-success');

    if (mainContactForm && mainContactSuccess) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide the form
            mainContactForm.style.display = 'none';
            
            // Show the success message
            mainContactSuccess.style.display = 'block';

            // Optional: Reset form after a delay if user might submit again
            // setTimeout(() => {
            //     mainContactForm.style.display = 'grid';
            //     mainContactSuccess.style.display = 'none';
            //     mainContactForm.reset();
            // }, 5000);
        });
    }

});
