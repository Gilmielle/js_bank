import { el, setChildren } from 'redom';
import './assets/libs/choices.min.css';
import './styles/common.scss';
import './styles/currency.scss';
import { getUserCurrencies, getAllCurrencies } from './components/api.js';
import header from './components/header.js';
import spinner from './components/spinner.js';
import { createUserCurrencies } from './components/user-currencies-list.js';
import { createCurrencyChange } from './components/currency-change.js';
import { createCurrencyExchange } from './components/currency-exchange.js';
import * as Choices from 'choices.js';

setChildren(window.document.body, [header, spinner]);

const navItems = document.querySelectorAll('.site-nav__link');
navItems.forEach((item) => {
  item.classList.remove('site-nav__link_active');
  if (item.href && item.href.endsWith('currency.html')) {
    item.classList.add('site-nav__link_active');
  }
});

spinner.classList.add('spinner_active');
Promise.all([
  getAllCurrencies(),
  getUserCurrencies(sessionStorage.userToken),
]).then((data) => {
  const allCurrencies = data[0].payload;
  const userCurrencies = data[1].payload;

  const userCurrenciesList = createUserCurrencies(userCurrencies);
  const currencyChange = createCurrencyChange();
  const currencyExchange = createCurrencyExchange(allCurrencies, spinner);

  const currencyBlock = el('div', { class: 'currency container' }, [
    el('h2', { class: 'currency__title', textContent: 'Валютный обмен' }),
    userCurrenciesList,
    currencyChange,
    currencyExchange,
  ]);

  window.document.body.append(currencyBlock);

  const selects = document.querySelectorAll('.exchange-select');
  selects.forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
    });
  });

  spinner.classList.remove('spinner_active');
});
