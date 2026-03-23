const API_URL = 'http://localhost:3000';

export function initNewsletter() {
  const modal = document.getElementById('newsletter-modal');
  const form = document.getElementById('newsletter-form');
  const successEl = document.getElementById('newsletter-success');
  const errorEl = document.getElementById('newsletter-error');

  if (!modal || !form) return;

  // Open modal from any element with data-newsletter
  document.querySelectorAll('[data-newsletter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Focus first input after animation
      setTimeout(() => {
        form.querySelector('input')?.focus();
      }, 300);
    });
  });

  // Close modal
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Reset error state
    errorEl.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
      };

      const res = await fetch(API_URL + '/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Request failed');

      // Show success
      form.style.display = 'none';
      modal.querySelector('.modal-subtitle').style.display = 'none';
      successEl.style.display = 'block';
    } catch {
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
