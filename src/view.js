import { domReady } from '@wordpress/dom';

domReady(() => {
  const images = document.querySelectorAll('.polaroid img');
  images?.forEach(function (img) {
    // Create loader
    let loader = document.createElement('div');
    loader.classList.add('polaroid-loader');

    // Hide image initially
    img.style.display = 'none';

    // Insert loader before image
    img.before(loader);

    img.onload = function () {
      // Remove loader and show image with fade-in effect
      loader.remove();
      img.style.display = 'block';
      img.classList.add('polaroid-loaded');
    };
  });
});
