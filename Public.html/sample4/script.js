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
            body.style.overflow = isOpen ? 'hidden' : 'auto';
            if (!isOpen) {
                 body.style.overflow = 'auto'; // Ensure scroll is restored
            }
        });
    }
    
    // Close mobile nav when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    });


    // --- Smooth Scroll for All Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Do not run smooth scroll for mobile nav links
            // as they are handled by the mobile nav closing logic
            if(mobileNav.contains(this) && mobileNav.classList.contains('open')) {
                // just let the mobile nav link handler close the menu
            } else {
                // continue with smooth scroll
            }

            try {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    let headerOffset = 0;
                    // Check if mobile header is active (matches @media max-width: 1200px)
                    if (window.innerWidth <= 1200 && document.querySelector('.top-header')) {
                        headerOffset = 70; // From :root --top-header-height
                    }
                    
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            } catch (error) {
                console.warn('Could not find element for smooth scroll:', targetId);
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
    if (faders.length > 0) {
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
    }
    
    
    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Main Contact Form Submission (Mock) ---
    const mainContactForm = document.getElementById('mainContactForm');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a mockup. In a real app, you'd send this to a server.
            // For now, just show a simple confirmation.
            alert('Thank you for your enquiry! We will get back to you soon.');
            mainContactForm.reset();
        });
    }

    // --- Contact Popup Modal Logic ---
    const openBtn = document.getElementById('openContactPopup');
    const closeBtn = document.getElementById('closeContactPopup');
    const overlay = document.getElementById('contactPopupOverlay');
    const popup = document.getElementById('contactPopup');
    const form = document.getElementById('popupContactForm');
    const formContent = document.getElementById('popupFormContent');
    const thankYouMessage = document.getElementById('popupThankYouMessage');

    if (openBtn && closeBtn && overlay && popup && form && formContent && thankYouMessage) {
        
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
                form.reset();
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

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide form, show thank you
            formContent.style.display = 'none';
            thankYouMessage.style.display = 'block';

            // Automatically close popup after 3 seconds
            setTimeout(() => {
                closePopup();
            }, 3000);
        });
    }

});
