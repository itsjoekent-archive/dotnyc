import './blog.css';
import './homepage.css';
import './index.css';
import './reset.css';

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

const copyButtons = document.querySelectorAll('[data-copy]');
const bioButtons = document.querySelectorAll('[data-bio-button]');
const bioText = document.querySelectorAll('[data-bio-format]');

copyButtons.forEach((element) => {
  element.addEventListener('click', () => {
    const copyValue = element.getAttribute('data-copy') || '';
    const copyMessage = element.getAttribute('data-copy-message') || 'Copied to clipboard';
    navigator.clipboard.writeText(copyValue).then(() => alert(copyMessage));
  });
});

bioButtons.forEach((buttonElement) => {
  buttonElement.addEventListener('click', () => {
    const targetFormat = buttonElement.getAttribute('data-bio-button');
    if (!targetFormat) return;

    bioButtons.forEach((buttonElement) => {
      if (buttonElement.getAttribute('data-bio-button') === targetFormat) {
        buttonElement.classList.add('--active');
      } else {
        buttonElement.classList.remove('--active');
      }
    });

    bioText.forEach((bioElement) => {
      if (bioElement.getAttribute('data-bio-format') === targetFormat) {
        bioElement.classList.add('--active');
      } else {
        bioElement.classList.remove('--active');
      }
    });
  });
});
