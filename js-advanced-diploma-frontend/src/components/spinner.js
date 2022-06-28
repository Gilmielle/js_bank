import { el } from 'redom';

const spinner = el(
  'div',
  {
    class: 'spinner',
  },
  el('div', {
    class: 'spinner__positioner',
    innerHTML: `<svg class="spinner__wrapper" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="31" class="spinner__backgr"></circle>
<circle cx="32" cy="32" r="31" class="spinner__filler"></circle>
</svg>`,
  })
);

export default spinner;
