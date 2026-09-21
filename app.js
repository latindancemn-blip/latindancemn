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
       4. HERO & CLASS TRIGGER ROUTING (AUTO-FILL FORM STATES)
       -------------------------------------------------------------------------- */
    const selectInquiry = document.getElementById('inquiryType');
    const messageInput = document.getElementById('message');

    // Sign Up & Waitlist buttons in Class Cards
    const classTriggers = document.querySelectorAll('.class-book-trigger');
    classTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const className = trigger.getAttribute('data-class');
            if (className.includes('Private')) {
                selectInquiry.value = 'private-coaching';
                messageInput.value = `Hi Priscila! I'm interested in booking the 4-Class Package for Private Dance Lessons ($240, 4 consecutive weekly 45-minute lessons at the St. Louis Park studio). My preferred dance style is [Forró / Samba Solo / Samba de Gafieira / Bachata / Salsa] and I'd love to schedule my first lesson!`;
            } else if (className.includes('Basic #2') || className.includes('Basics #2')) {
                selectInquiry.value = 'forro-workshop';
                messageInput.value = `Hi Priscila! I would love to sign up for the 5-Week Forró Dance Workshop Basic #2 ($75 if paid by September 30, $85 afterwards, Thursdays in October 7:00 PM – 8:00 PM at Sabathani Community Center). Please let me know how to complete my registration!`;
            } else if (className.includes('Basic #1') || className.includes('Basics #1') || className.includes('5-Week') || className.includes('4-Week')) {
                selectInquiry.value = 'forro-workshop';
                messageInput.value = `Hi Priscila! I would love to add my name to the waitlist for the 5-Week Forró Dance Basics #1 (Early Bird Special: $65 if registered & paid by September 25, regular $75 at Sabathani Community Center). Please let me know once dates and registration are confirmed!`;
            } else if (className.includes('Forró')) {
                selectInquiry.value = 'forro-workshop';
                messageInput.value = `Hi Priscila! I would love to join your upcoming Forró Dance Workshop at Sabathani Community Center. Please let me know the details!`;
            } else if (className.includes('Free September') || className.includes('TRY FOR FREE')) {
                selectInquiry.value = 'class-signup';
                messageInput.value = `Hi Priscila! I would love to sign up for Samba Dance Foundations for Beginners — TRY FOR FREE in September Only (Wednesdays at 7:30 PM - 8:30 PM at the Center for Performing Arts)!`;
            } else if (className.includes('October') || className.includes('Beginners')) {
                selectInquiry.value = 'class-signup';
                messageInput.value = `Hi Priscila! I would love to sign up for Samba Dance Foundations for Beginners starting October 7, 2026 (Wednesdays at 7:30 PM - 8:30 PM at Studio 305, Center for Performing Arts). Please let me know the registration and payment details!`;
            } else {
                selectInquiry.value = 'class-signup';
                messageInput.value = `Hi Priscila! I would love to sign up for your Samba Dance Foundations Intermediate on Wednesdays at 6:30 PM - 7:30 PM at the Center for Performing Arts. Please let me know the registration and payment details!`;
            }
        });
    });

    /* --------------------------------------------------------------------------
       5. SMART EMAIL VALIDATION & BOOKING FORM CONTROLLER
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('emailFeedback');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Common domain typo correction dictionary
    const DOMAIN_TYPOS = {
        // Gmail typos
        'gmai.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gmaul.com': 'gmail.com',
        'gmaik.com': 'gmail.com',
        'gmail.con': 'gmail.com',
        'gmail.co': 'gmail.com',
        'gmaio.com': 'gmail.com',
        'gmal.com': 'gmail.com',
        'gmale.com': 'gmail.com',
        'gmai.co': 'gmail.com',
        'gmail.cm': 'gmail.com',
        // Yahoo typos
        'yaho.com': 'yahoo.com',
        'yahooo.com': 'yahoo.com',
        'yhaoo.com': 'yahoo.com',
        'yahoo.con': 'yahoo.com',
        'yhoo.com': 'yahoo.com',
        'ymail.con': 'ymail.com',
        // Hotmail typos
        'hotmial.com': 'hotmail.com',
        'hotmaill.com': 'hotmail.com',
        'homail.com': 'hotmail.com',
        'hotamil.com': 'hotmail.com',
        'hotmail.con': 'hotmail.com',
        'hotmai.com': 'hotmail.com',
        // Outlook typos
        'outlok.com': 'outlook.com',
        'outloo.com': 'outlook.com',
        'outlook.con': 'outlook.com',
        'outlock.com': 'outlook.com',
        // iCloud typos
        'iclud.com': 'icloud.com',
        'icoud.com': 'icloud.com',
        'icloud.con': 'icloud.com',
        'icluod.com': 'icloud.com'
    };

    let userOverrodeSuggestion = false;

    function getEmailValidationStatus(val) {
        const email = (val || '').trim();
        if (!email) {
            return { isValid: false, isEmpty: true, message: 'Please enter your email address.' };
        }

        // Standard strict RFC pattern
        const basicRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        
        if (!basicRegex.test(email)) {
            if (!email.includes('@')) {
                return { isValid: false, message: 'Missing "@" in email address.' };
            }
            const parts = email.split('@');
            if (parts.length > 2) {
                return { isValid: false, message: 'Email cannot contain multiple "@" symbols.' };
            }
            if (!parts[1] || !parts[1].includes('.')) {
                return { isValid: false, message: 'Please include a full domain ending (e.g. .com, .org).' };
            }
            return { isValid: false, message: 'Please enter a valid email address (e.g., name@example.com).' };
        }

        const parts = email.split('@');
        const local = parts[0];
        const domain = parts[1].toLowerCase();

        // Check for common top-level domain typos (e.g. .con instead of .com)
        if (DOMAIN_TYPOS[domain]) {
            const suggestedEmail = `${local}@${DOMAIN_TYPOS[domain]}`;
            return {
                isValid: true,
                isSuggestion: true,
                suggestedEmail: suggestedEmail,
                message: `Did you mean <strong>${suggestedEmail}</strong>?`
            };
        }

        if (domain.endsWith('.con')) {
            const correctedDomain = domain.replace(/\.con$/, '.com');
            const suggestedEmail = `${local}@${correctedDomain}`;
            return {
                isValid: true,
                isSuggestion: true,
                suggestedEmail: suggestedEmail,
                message: `Did you mean <strong>${suggestedEmail}</strong>?`
            };
        }

        // TLD length check
        const tld = domain.substring(domain.lastIndexOf('.') + 1);
        if (tld.length < 2) {
            return { isValid: false, message: 'Domain extension is too short (e.g., .com).' };
        }

        return { isValid: true, isSuggestion: false };
    }

    function renderEmailFeedback(status) {
        if (!emailFeedback || !emailInput) return;

        emailInput.classList.remove('is-invalid', 'is-valid', 'is-warning', 'shake');

        if (status.isEmpty) {
            emailFeedback.className = 'field-feedback';
            emailFeedback.innerHTML = '';
            return;
        }

        if (!status.isValid) {
            emailInput.classList.add('is-invalid');
            emailFeedback.className = 'field-feedback error active';
            emailFeedback.innerHTML = `⚠️ ${status.message}`;
        } else if (status.isSuggestion && !userOverrodeSuggestion) {
            emailInput.classList.add('is-warning');
            emailFeedback.className = 'field-feedback warning active';
            emailFeedback.innerHTML = `
                <div class="email-suggestion-chip">
                    <span>${status.message}</span>
                    <button type="button" class="email-suggestion-btn" id="btnApplyEmailFix">Use this email</button>
                </div>
            `;
            
            const btnFix = document.getElementById('btnApplyEmailFix');
            if (btnFix) {
                btnFix.addEventListener('click', () => {
                    emailInput.value = status.suggestedEmail;
                    userOverrodeSuggestion = false;
                    validateEmailField();
                    emailInput.focus();
                });
            }
        } else {
            emailInput.classList.add('is-valid');
            emailFeedback.className = 'field-feedback';
            emailFeedback.innerHTML = '';
        }
    }

    function validateEmailField() {
        if (!emailInput) return { isValid: true };
        const status = getEmailValidationStatus(emailInput.value);
        renderEmailFeedback(status);
        return status;
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            userOverrodeSuggestion = false;
            // Validate on input if currently showing an error or warning
            if (emailInput.classList.contains('is-invalid') || emailInput.classList.contains('is-warning')) {
                validateEmailField();
            } else if (emailInput.value.includes('@') && emailInput.value.includes('.')) {
                // Check if user typed a complete domain
                validateEmailField();
            }
        });

        emailInput.addEventListener('blur', () => {
            if (emailInput.value.trim().length > 0) {
                validateEmailField();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const emailStatus = validateEmailField();

            if (!emailStatus.isValid || (emailStatus.isSuggestion && !userOverrodeSuggestion)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                emailInput.classList.remove('shake');
                // Trigger reflow to restart CSS shake animation
                void emailInput.offsetWidth;
                emailInput.classList.add('shake');
                emailInput.focus();

                if (emailStatus.isSuggestion) {
                    // If user submits again without clicking fix, permit intentional submission
                    userOverrodeSuggestion = true;
                }
                return;
            }

            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn ? submitBtn.querySelector('span') : null;
            const originalText = btnText ? btnText.textContent : 'Send Request';
            
            if (btnText) btnText.textContent = 'Sending Samba Request...';
            if (submitBtn) submitBtn.style.pointerEvents = 'none';

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
                    if (formSuccess) formSuccess.classList.add('active');
                    contactForm.reset();
                    if (emailFeedback) {
                        emailFeedback.className = 'field-feedback';
                        emailFeedback.innerHTML = '';
                    }
                    if (emailInput) emailInput.classList.remove('is-valid', 'is-invalid', 'is-warning');
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a connection error. Please try again.');
            })
            .finally(() => {
                if (btnText) btnText.textContent = originalText;
                if (submitBtn) submitBtn.style.pointerEvents = 'auto';
            });
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            if (formSuccess) formSuccess.classList.remove('active');
        });
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
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // Close on clicking lightbox backdrop background
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    /* --------------------------------------------------------------------------
       8. SCROLL REVEAL ENTRANCE ANIMATIONS
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.animate-on-scroll');

    if (typeof IntersectionObserver === 'undefined') {
        // Fallback: immediately show all animated elements if IntersectionObserver is not supported
        revealElements.forEach(elem => {
            elem.classList.add('appear');
        });
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.05, // Lower threshold for more reliable triggering on mobile screens
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(elem => {
            revealObserver.observe(elem);
        });
    }
});
