import { el } from 'redom';
import { createTransfersHistoryElem } from './transfers-history-table.js';
import createMoneyTransferForm from './money-transfer-form.js';
import { createBalanceBarChartElem } from './bar-chart.js';
import '../styles/account-details.scss';
import arrow from '../assets/images/arrow.svg';

export function createAccDetailsHeader(data, title, btnHref) {
  const header = el('div', { class: 'account-details__header' }, [
    el('h1', {
      class: 'account-details__title',
      textContent: title,
    }),
    el('a', { class: 'account-details__btn btn btn_primary', href: btnHref }, [
      el('img', { class: 'account-details__btn-icon', src: arrow }),
      el('span', {
        class: 'account-details__btn-text',
        textContent: 'Вернуться назад',
      }),
    ]),
    el('p', {
      class: 'account-details__number',
      textContent: `№ ${data.account}`,
    }),
    el(
      'p',
      { class: 'account-details__balance', textContent: 'Баланс' },
      el('span', {
        class: 'account-details__balance-sum',
        textContent: `${data.balance.toLocaleString('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        })}`,
      })
    ),
  ]);

  return header;
}

export function renderAccDetails(data, spinner) {
  const header = createAccDetailsHeader(data, 'Просмотр счёта', 'index.html');
  const form = createMoneyTransferForm(data.account, spinner);
  const barChart = createBalanceBarChartElem(data, 6);
  const transfersHistory = createTransfersHistoryElem(data);
  const detailedPage = el('div', { class: 'container account-details' }, [
    header,
    form,
    barChart,
    transfersHistory,
  ]);
  return detailedPage;
}
