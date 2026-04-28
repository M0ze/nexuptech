// Form handler - sends to WhatsApp
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const msg = document.getElementById('message').value;
  
  // CHANGE THIS: Replace 256XXXXXXXXX with your WhatsApp number
  const whatsappNumber = '256XXXXXXXXX';
  const whatsappText = `Hi NexUpTech! I'm ${name}. Project: ${msg}. Email: ${email}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  
  alert('Thanks! We\'ll contact you soon. Opening WhatsApp...');
  window.open(whatsappLink, '_blank');
  
  e.target.reset();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});