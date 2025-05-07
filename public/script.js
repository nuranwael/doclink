//menu
const burgerCheckbox = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burgerCheckbox.addEventListener('change', () => {
  if (burgerCheckbox.checked) {
    navLinks.classList.add('active');
  } else {
    navLinks.classList.remove('active');
  }
});
//cards
const wrappers = document.querySelectorAll('.card-wrapper');

wrappers.forEach(wrapper => {
  const button = wrapper.querySelector('.read-more');
  const moreText = wrapper.querySelector('.more-text');

  button.addEventListener('click', () => {
    const isActive = wrapper.classList.contains('active');

  
    wrappers.forEach(otherWrapper => {
      if (otherWrapper !== wrapper) {
        otherWrapper.classList.remove('active', 'inactive');
        const otherText = otherWrapper.querySelector('.more-text');
        if (otherText) otherText.style.display = 'none';
        const otherButton = otherWrapper.querySelector('.read-more');
        if (otherButton) otherButton.textContent = 'Read More >';
      }
    });

    if (isActive) {
      
      wrapper.classList.remove('active');
      moreText.style.display = 'none';
      button.textContent = 'Read More >';
    } else {
    
      wrapper.classList.add('active');
      moreText.style.display = 'block';
      button.textContent = 'Read Less <';

    
      wrappers.forEach(otherWrapper => {
        if (otherWrapper !== wrapper) {
          otherWrapper.classList.add('inactive');
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll(".cardz, .card");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
            }
        });
    }, { threshold: 0.2 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
});
