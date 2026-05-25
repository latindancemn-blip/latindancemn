/* ==========================================================================
   LATIN DANCE MN - CORE INTERACTIVITY ENGINE
   Vanilla JS implementing dynamic UI transitions, modals, & lightboxes
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide SVG Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* --------------------------------------------------------------------------
       1. STICKY HEADER & ACTIVE SCROLL STATE
       -------------------------------------------------------------------------- */
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Highlight current section in navbar
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --------------------------------------------------------------------------
       2. MOBILE HAMBURGER MENU
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const iconOpen = mobileToggle.querySelector('.icon-open');
    const iconClose = mobileToggle.querySelector('.icon-close');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Lock background scroll
        } else {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close menu when tapping links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    /* --------------------------------------------------------------------------
       3. TICKET SPOTLIGHT MODAL OVERLAY
       -------------------------------------------------------------------------- */
    const reserveModal = document.getElementById('reserveModal');
    const openModalBtn = document.getElementById('openReserveModal');
    const closeModalBtn = document.getElementById('closeReserveModal');
    const reserveForm = document.getElementById('reserveForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const closeModalSuccessBtn = document.getElementById('closeModalSuccessBtn');

    function openModal() {
        reserveModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        reserveModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalSuccess.classList.remove('active');
            reserveForm.reset();
        }, 300);
    }

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeModalSuccessBtn) closeModalSuccessBtn.addEventListener('click', closeModal);

    // Close when tapping outside card
    reserveModal.addEventListener('click', (e) => {
        if (e.target === reserveModal) {
            closeModal();
        }
    });

    // Reserve ticket form submission animation
    reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = reserveForm.querySelector('.modal-submit');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Securing Spotlight Seating...';
        submitBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            modalSuccess.classList.add('active');
            btnText.textContent = originalText;
            submitBtn.style.pointerEvents = 'auto';
        }, 1500);
    });

    /* --------------------------------------------------------------------------
       4. HERO & CLASS TRIGGER ROUTING (AUTO-FILL FORM STATES)
       -------------------------------------------------------------------------- */
    const selectInquiry = document.getElementById('inquiryType');
    const messageInput = document.getElementById('message');

    // Sign Up buttons in Class Cards
    const classTriggers = document.querySelectorAll('.class-book-trigger');
    classTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const className = trigger.getAttribute('data-class');
            if (className.includes('Forró')) {
                selectInquiry.value = 'forro-workshop';
                messageInput.value = `Hi Priscila! I am very interested in joining your 1-month Forró beginners workshop on Mondays. Please put my name on the waiting list and notify me as soon as the venue in Minneapolis is confirmed!`;
            } else {
                selectInquiry.value = 'class-signup';
                messageInput.value = `Hi Priscila! I would love to sign up for your Samba Dance Lessons on Wednesdays at the Center for Performing Arts. Please let me know the registration and payment details!`;
            }
        });
    });

    /* --------------------------------------------------------------------------
       5. CONTACT & BOOKING FORM CONTROLLER (AJAX-STYLE RESPONSE)
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Sending Samba Request...';
        submitBtn.style.pointerEvents = 'none';

        // Pack form data into FormData object
        const formData = new FormData(contactForm);

        // Submit to Formspree via AJAX
        fetch('https://formspree.io/f/mykvngkq', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success animation overlay
                formSuccess.classList.add('active');
                contactForm.reset();
            } else {
                alert('Oops! There was a problem submitting your form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a connection error. Please try again.');
        })
        .finally(() => {
            btnText.textContent = originalText;
            submitBtn.style.pointerEvents = 'auto';
        });
    });

    resetFormBtn.addEventListener('click', () => {
        formSuccess.classList.remove('active');
    });

    /* --------------------------------------------------------------------------
       6. SHOW PERFORMANCE COUNTDOWN TIMER (AURORA DO SAMBA)
       -------------------------------------------------------------------------- */
    const countdown = document.getElementById('countdown');
    if (countdown) {
        const targetDateStr = countdown.getAttribute('data-date');
        const targetDate = new Date(targetDateStr).getTime();

        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                daysSpan.textContent = "00";
                hoursSpan.textContent = "00";
                minutesSpan.textContent = "00";
                secondsSpan.textContent = "00";
                
                // Show is live or has passed
                const countdownLabel = document.querySelector('.aurora-tagline');
                if (countdownLabel) countdownLabel.textContent = "AURORA DO SAMBA SHOW IS LIVE!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysSpan.textContent = String(days).padStart(2, '0');
            hoursSpan.textContent = String(hours).padStart(2, '0');
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown(); // Run once instantly
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    /* --------------------------------------------------------------------------
       7. INTERACTIVE GALLERY IMAGE LIGHTBOX
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentGalleryIndex = 0;
    const galleryImages = [];

    // Map gallery images array
    galleryItems.forEach((item, index) => {
        galleryImages.push({
            src: item.getAttribute('data-src'),
            caption: item.getAttribute('data-caption')
        });

        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox(currentGalleryIndex);
        });
    });

    function openLightbox(index) {
        const item = galleryImages[index];
        lightboxImg.src = item.src;
        lightboxCaption.textContent = item.caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateLightboxContent(currentGalleryIndex);
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent(currentGalleryIndex);
    }

    function updateLightboxContent(index) {
        // Add subtle scale out animation trigger
        lightboxImg.style.transform = 'scale(0.97)';
        lightboxImg.style.opacity = '0.7';
        
        setTimeout(() => {
            const item = galleryImages[index];
            lightboxImg.src = item.src;
            lightboxCaption.textContent = item.caption;
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // Close on clicking lightbox backdrop background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    /* --------------------------------------------------------------------------
       8. SCROLL REVEAL ENTRANCE ANIMATIONS
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.animate-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });
});
