/**
 * Animated counter — counts from 0 to target using requestAnimationFrame.
 * Triggered when element gets the 'visible' class.
 */
export function animateCounters(container) {
  const counters = container.querySelectorAll('[data-counter]');

  counters.forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.classList.add('counted');
      }
    }

    requestAnimationFrame(update);
  });
}

function formatNumber(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(0) + 'M';
  }
  if (n >= 1000) {
    return n.toLocaleString('fr-FR');
  }
  return n.toString();
}
