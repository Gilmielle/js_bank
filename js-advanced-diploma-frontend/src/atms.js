import { el, setChildren } from 'redom';
import { createErrorMsg } from './components/utils.js';
import './styles/common.scss';
import { getBankCoords } from './components/api.js';
import { createMap } from './components/bank-map.js';
import './styles/bank-map.scss';
import header from './components/header.js';
import spinner from './components/spinner.js';

setChildren(window.document.body, [header, spinner]);

const navItems = document.querySelectorAll('.site-nav__link');
navItems.forEach((item) => {
  item.classList.remove('site-nav__link_active');
  if (item.href && item.href.endsWith('atms.html')) {
    item.classList.add('site-nav__link_active');
  }
});

new Promise((resolve) => {
  spinner.classList.add('spinner_active');
  resolve(getBankCoords());
}).then(async (data) => {
  if (data.payload !== null) {
    const mapClass = 'bank-map__map';
    const banksBlock = el('div', { class: 'container bank-map' }, [
      el('h2', { class: 'bank-map__title', textContent: 'Карта банкоматов' }),
    ]);
    window.document.body.append(banksBlock);
    try {
      await createMap(mapClass, data.payload, banksBlock);
    } catch (error) {
      const errorMsg = createErrorMsg();
      banksBlock.append(errorMsg);
    }
    spinner.classList.remove('spinner_active');
  } else {
    const error = createErrorMsg();
    window.document.body.append(error);
  }
});
