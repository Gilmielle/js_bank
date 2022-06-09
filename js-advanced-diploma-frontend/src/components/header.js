import { el } from 'redom';
import '../styles/header.scss';
import logo from '../assets/images/logo.png';

const header = el(
  'div',
  { class: 'header' },
  el('div', { class: 'container header__container' }, [
    el('img', { class: 'header__logo', src: logo }),
    el('nav', { class: 'header__nav header-nav' }, [
      el('ul', { class: 'header-nav__site-nav site-nav' }, [
        el('li', { class: 'site-nav__item' }, [
          el('a', {
            class: 'site-nav__link btn btn_secondary',
            textContent: 'Банкоматы',
            href: 'atms.html',
          }),
        ]),
        el('li', { class: 'site-nav__item' }, [
          el('a', {
            class: 'site-nav__link btn btn_secondary',
            textContent: 'Счета',
            href: 'accounts.html',
          }),
        ]),
        el('li', { class: 'site-nav__item' }, [
          el('a', {
            class: 'site-nav__link btn btn_secondary',
            textContent: 'Валюта',
            href: 'currency.html',
          }),
        ]),
        el('li', { class: 'site-nav__item' }, [
          el('a', {
            class: 'site-nav__link btn btn_secondary',
            textContent: 'Выйти',
            href: 'login.html',
          }),
        ]),
      ]),
    ]),
  ])
);

export default header;
