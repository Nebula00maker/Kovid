document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  const hasSubmenu = document.querySelector('.has-submenu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const submenuLink = hasSubmenu?.querySelector('a');

  // Toggle menu on burger click
  if (burgerMenu) {
    burgerMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      burgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (menuOverlay) {
        menuOverlay.classList.toggle('active');
      }
    });
  }

  // Handle submenu clicks in mobile view
  if (hasSubmenu) {
    // Handle the main submenu link click
    submenuLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation(); // Prevent the click from bubbling to parent
        hasSubmenu.classList.toggle('active');
      }
    });

    // Handle clicks on the submenu items
    const submenuItems = hasSubmenu.querySelectorAll('.submenu a');
    submenuItems.forEach(item => {
      item.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.stopPropagation(); // Prevent bubbling
          hasSubmenu.classList.remove('active'); // Close only the submenu
          // Don't close the burger menu
        }
      });
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', function (e) {
    const clickedInSubmenu = hasSubmenu?.contains(e.target);
    const clickedInNav = navLinks?.contains(e.target);
    const clickedBurger = burgerMenu?.contains(e.target);

    if (!clickedInNav && !clickedBurger) {
      // Close everything when clicking outside nav
      navLinks?.classList.remove('active');
      burgerMenu?.classList.remove('active');
      hasSubmenu?.classList.remove('active');
      menuOverlay?.classList.remove('active');
    } else if (!clickedInSubmenu && window.innerWidth <= 768) {
      // Only close submenu when clicking elsewhere in nav
      hasSubmenu?.classList.remove('active');
    }
  });
  // DOM Elements
  // (Already declared above)
  const searchTrigger = document.getElementById('search-trigger');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  const header = document.querySelector('.container-header');
  const images = document.querySelectorAll('.article-image');
  const popup = document.querySelector('.popup-overlay');
  const popupImage = document.querySelector('.popup-image');
  const closeButton = document.querySelector('.popup-close');
  const prevButton = document.querySelector('.popup-nav-button.prev');
  const nextButton = document.querySelector('.popup-nav-button.next');

  // State variables
  let menuOpen = false;
  let currentImageIndex = 0;

  // Simple menu toggle
  burgerMenu.addEventListener('click', function () {
    navLinks.classList.toggle('active');
  });

  // Sample data for search
  const sampleData = [
    {
      title: 'Active Cases',
      description: 'Current active COVID-19 cases',
      id: 'active-cases',
      section: 'stats-section'
    },
    {
      title: 'Recovered Cases',
      description: 'Total recovered COVID-19 patients',
      id: 'recovered-cases',
      section: 'stats-section'
    },
    {
      title: 'Vaccination',
      description: 'COVID-19 vaccination statistics',
      id: 'vaccination',
      section: 'stats-section'
    },
    {
      title: 'Prevention',
      description: 'How to protect yourself from COVID-19',
      id: 'prevention',
      section: 'hero-section'
    },
    {
      title: 'Symptoms',
      description: 'Common COVID-19 symptoms',
      id: 'symptoms',
      section: 'stats-section'
    }
  ];

  // Header scroll functionality
  function handleScroll() {
    if (header) {
      header.classList.toggle('header-scrolled', window.scrollY > 50);
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Set initial state

  // Mobile menu functionality
  function toggleMobileMenu(show) {
    if (!burgerMenu || !navLinks) return;

    menuOpen = show;
    burgerMenu.classList.toggle('active', show);
    navLinks.classList.toggle('active', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  if (burgerMenu) {
    burgerMenu.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu(!menuOpen);
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768 && menuOpen) {
      const isClickInside = navLinks?.contains(e.target) || burgerMenu?.contains(e.target);
      if (!isClickInside) {
        toggleMobileMenu(false);
      }
    }
  });

  // Close mobile menu when a nav link is clicked (except search)
  document.querySelectorAll('.nav-links li:not(#search-trigger)').forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        toggleMobileMenu(false);
      }
    });
  });

  // Search functionality
  function toggleSearch(show) {
    if (!searchOverlay || !searchInput || !burgerMenu) return;

    searchOverlay.classList.toggle('active', show);
    if (show) {
      searchInput.value = '';
      searchInput.focus();
      burgerMenu.style.display = 'none';
      toggleMobileMenu(false);
    } else {
      searchInput.value = '';
      searchResults.innerHTML = '';
      burgerMenu.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    }
    document.body.style.overflow = show ? 'hidden' : '';
  }

  if (searchTrigger) {
    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSearch(true);
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', () => toggleSearch(false));
  }

  // Close search when clicking outside the search container
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        toggleSearch(false);
      }
    });
  }

  // Close search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchOverlay?.classList.contains('active')) {
        toggleSearch(false);
      }
    }
  });

  // Search input handler
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredResults = sampleData.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );

      searchResults.innerHTML = filteredResults
        .map(item => `
          <div class="search-result-item" data-section="${item.section}" data-id="${item.id}">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <span class="search-result-link">Click to view →</span>
          </div>
        `)
        .join('');

      // Add click handlers to search results
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const section = document.querySelector(`.${item.dataset.section}`);
          if (section) {
            toggleSearch(false);
            section.scrollIntoView({ behavior: 'smooth' });

            const targetCard = section.querySelector(`[data-id="${item.dataset.id}"]`);
            if (targetCard) {
              targetCard.classList.add('highlight-item');
              setTimeout(() => targetCard.classList.remove('highlight-item'), 2000);
            }
          }
        });
      });
    });
  }

  // Image Popup Functionality
  function updatePopupImage() {
    if (!images[currentImageIndex] || !popupImage) return;

    popupImage.src = images[currentImageIndex].src;
    popupImage.alt = images[currentImageIndex].alt;
  }

  function closePopup() {
    if (!popup) return;

    popup.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open popup when clicking an image
  images.forEach((image, index) => {
    image.addEventListener('click', () => {
      currentImageIndex = index;
      updatePopupImage();
      if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Navigation controls
  if (closeButton) {
    closeButton.addEventListener('click', closePopup);
  }

  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updatePopupImage();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updatePopupImage();
    });
  }

  // Keyboard navigation for popup
  document.addEventListener('keydown', (e) => {
    if (!popup?.classList.contains('active')) return;

    switch (e.key) {
      case 'ArrowLeft':
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updatePopupImage();
        break;
      case 'ArrowRight':
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updatePopupImage();
        break;
      case 'Escape':
        closePopup();
        break;
    }
  });
});
