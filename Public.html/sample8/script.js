document.addEventListener('DOMContentLoaded', function() {
    const topNav = document.getElementById('topNav');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    let headerHeight = 70; // Initial header height based on padding-top

     // --- Adjust Header & Body Padding ---
    function updateHeaderLayout() {
        if (topNav) {
            headerHeight = topNav.offsetHeight;
            body.style.paddingTop = headerHeight + 'px';
        }
    }
    updateHeaderLayout(); // Initial check
    window.addEventListener('resize', updateHeaderLayout); // Update on resize

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (!topNav) return;
        if (window.scrollY > 50) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
         // Update height potentially changes padding
        updateHeaderLayout();
    });


    // --- Mobile Menu Toggle ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : ''; // Prevent body scroll
        });

        // Close menu when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (!mainNav || !menuToggle) return;
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = ''; // Re-enable scroll
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Don't scroll for placeholder links
            if (targetId === '#') return; 
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let elementPosition = targetElement.getBoundingClientRect().top;
                // Use the dynamically updated headerHeight
                let offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                // Special case for #home to scroll to top
                if (targetId === '#home') {
                    offsetPosition = 0;
                }

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile nav if open
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    if (menuToggle) {
                        menuToggle.classList.remove('open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                    body.style.overflow = ''; // Re-enable scroll
                }
            }
        });
    });

    // --- Fade-in on Scroll (IntersectionObserver) ---
    const faders = document.querySelectorAll('.fade-in');
    
    if (faders.length > 0) {
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function(
            entries,
            appearOnScroll
        ) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        },
        appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    }
    
     // --- Hero Slider ---
    const slider = document.getElementById('heroSlider');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    let slideIndex = 0;
    let slides;
    let slideInterval;

    function showSlide(index) {
        if (!slider) return;
        slides = slider.querySelectorAll('.hero-slide');
         if (slides.length === 0) return; // Exit if no slides found
        
        if (index >= slides.length) { slideIndex = 0; }
        if (index < 0) { slideIndex = slides.length - 1; }
        slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    function nextSlide() {
        slideIndex++;
        showSlide(slideIndex);
    }
    
    function prevSlide() {
        slideIndex--;
        showSlide(slideIndex);
    }

    function startSlideShow() {
        stopSlideShow(); // Clear existing interval first
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
         clearInterval(slideInterval);
    }

    if (slider && prevButton && nextButton) {
        slides = slider.querySelectorAll('.hero-slide'); // Get slides initially
        if (slides.length > 0) {
             showSlide(slideIndex); // Initial display
             startSlideShow(); // Start automatic sliding

             nextButton.addEventListener('click', () => {
                 nextSlide();
                 stopSlideShow(); // Stop auto-slide on manual control
                 startSlideShow(); // Restart timer
             });
             
             prevButton.addEventListener('click', () => {
                 prevSlide();
                  stopSlideShow(); // Stop auto-slide on manual control
                 startSlideShow(); // Restart timer
             });
        } else {
             console.warn("Hero slider found, but no slides inside.");
        }
    }


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
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

