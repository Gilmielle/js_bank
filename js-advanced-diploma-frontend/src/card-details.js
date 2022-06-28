import { setChildren } from 'redom';
import { createErrorMsg } from './components/utils.js';
import './styles/common.scss';
import { getAccountDetails } from './components/api.js';
import { renderAccDetails } from './components/account-details.js';
import autocomplete from './components/autocomplete.js';
import header from './components/header.js';
import spinner from './components/spinner.js';
import { renderBalanceHistory } from './components/balance-history.js';

setChildren(window.document.body, [header, spinner]);

const navItems = document.querySelectorAll('.site-nav__link');
navItems.forEach((item) => {
  item.classList.remove('site-nav__link_active');
});

new Promise((resolve) => {
  spinner.classList.add('spinner_active');
  resolve(
    getAccountDetails(sessionStorage.userToken, sessionStorage.accountId)
  );
}).then((data) => {
  if (data.payload !== null) {
    const details = renderAccDetails(data.payload, spinner);
    window.document.body.append(details);
    if (localStorage[sessionStorage.userToken]) {
      autocomplete(document.getElementById('account-to'));
    }

    const chart = document.querySelector('.balance-chart');
    chart.style = 'cursor: pointer';
    chart.addEventListener('click', () => {
      renderBalanceHistory(data.payload);
    });

    const history = document.querySelector('.transfer-history');
    history.style = 'cursor: pointer';
    history.addEventListener('click', () => {
      renderBalanceHistory(data.payload);
    });
    spinner.classList.remove('spinner_active');
  } else {
    const error = createErrorMsg();
    window.document.body.append(error);
  }
});
