document.addEventListener('DOMContentLoaded', () => {
  // --- STICKY NAV & SCROLL EFFECTS ---
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    // Header stickiness
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // Scroll to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- DARK/LIGHT THEME SWITCHER ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  
  if (themeToggleBtn) {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
    });
  }

  // --- MOBILE BURGER MENU ---
  const burgerMenuBtn = document.querySelector('.burger-menu');
  const navList = document.querySelector('.nav-list');

  if (burgerMenuBtn && navList) {
    burgerMenuBtn.addEventListener('click', () => {
      header.classList.toggle('menu-open');
      navList.classList.toggle('active');
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        navList.classList.remove('active');
      });
    });
  }

  // --- PRODUCT GALLERY FILTER ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  if (filterTabs.length > 0 && productCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active class
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterValue = tab.getAttribute('data-filter');

        // Filter cards
        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            // Simple entry fade animation
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- LIGHTBOX GALLERY ---
  const lightbox = document.getElementById('product-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const zoomBtns = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImg && zoomBtns.length > 0) {
    zoomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const imgSrc = btn.getAttribute('data-image');
        const imgCaption = btn.getAttribute('data-title') || 'Product Image';
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = imgCaption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling background
      });
    });

    // Close on click close button or overlay
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- INQUIRY FORM HANLDING ---
  const inquiryForm = document.getElementById('inquiry-form');
  const formFeedback = document.querySelector('.form-feedback');

  if (inquiryForm) {
    // Pre-fill interest if product selected via URL param
    const urlParams = new URLSearchParams(window.location.search);
    const productInterest = urlParams.get('product');
    const interestSelect = document.getElementById('product-interest');
    
    if (productInterest && interestSelect) {
      interestSelect.value = productInterest;
    }

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Perform validation check
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !phone || !message) {
        showFeedback('Please fill out all required fields.', 'error');
        return;
      }

      // Start simulated submission loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      formFeedback.style.display = 'none';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success
        showFeedback(`Thank you, ${name}! Your inquiry has been sent successfully. We will get back to you shortly.`, 'success');
        
        // Reset form
        inquiryForm.reset();
      }, 1500);
    });
  }

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = 'form-feedback'; // reset
    formFeedback.classList.add(type);
    
    // Scroll feedback into view
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
