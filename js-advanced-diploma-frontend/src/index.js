import { el, setChildren } from 'redom';
import './assets/libs/choices.min.css';
import './styles/common.scss';
import header from './components/header.js';
import spinner from './components/spinner.js';
import authFormBlock from './components/auth-form.js';
import * as Choices from 'choices.js';

const title = el('h1', {
  class: 'visually-hidden page-title',
  textContent: 'Главная страница банка Coin',
});

setChildren(window.document.body, [header, title, authFormBlock, spinner]);

if (!sessionStorage.userToken) {
  header.classList.add('header_reduced');
} else {
  authFormBlock.remove();
  document.title = 'Банк Coin | Счета';
  spinner.classList.add('spinner_active');
  import('./components/card-list.js').then(async (obj) => {
    try {
      const cardsBlock = await obj.createCardsBlock();
      window.document.body.append(cardsBlock);
      obj.createCustomSelect(Choices);
    } finally {
      spinner.classList.remove('spinner_active');
    }
  });
}
