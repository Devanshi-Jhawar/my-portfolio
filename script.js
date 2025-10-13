  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.video-box').forEach(box => {
      const video = box.querySelector('video');
      const playBtnContainer = box.querySelector('.play-button-container');
      const label = playBtnContainer.querySelector('label');

      // Initial: hide controls
      video.controls = false;

      label.addEventListener('click', () => {
        video.play();
        video.controls = true; // show controls
        playBtnContainer.style.display = 'none';
      });

      video.addEventListener('ended', () => {
        playBtnContainer.style.display = 'grid';
        video.controls = false; // hide controls again
      });
    });

    // Scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Observe sections
    document.querySelectorAll('.section-container').forEach(section => {
      observer.observe(section);
    });

    // Smooth navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
      } else {
        navbar.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.2)';
      }
    });

    // Add smooth cursor effects
    document.querySelectorAll('.card, .skill-badge, .social-icons a, .btn').forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
      });
    });
  });


  function scrollVideos(direction, button) {
    const slider = button
      .closest('.position-relative')
      ?.querySelector('[id$="-slider"]');

    if (!slider) return;

    const card = slider.querySelector('.card');
    if (!card) return;

    const cardStyle = window.getComputedStyle(card);
    const marginRight = parseInt(cardStyle.marginRight) || 16;
    const cardWidth = card.offsetWidth + marginRight;

    slider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }



  