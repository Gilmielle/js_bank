import { createAccDetailsHeader } from './account-details.js';
import { createBalanceBarChartElem } from './bar-chart.js';
import { createTransfersHistoryElem } from './transfers-history-table.js';

export function renderBalanceHistory(data) {
  document.title = 'Банк Coin | История баланса';
  const accDetailsElem = document.querySelector('.account-details');
  accDetailsElem.textContent = '';
  const header = createAccDetailsHeader(data, 'История баланса', '');
  accDetailsElem.append(header);

  const historyBarChart = createBalanceBarChartElem(data, 12);
  historyBarChart.classList.add('balance-chart_wide');
  accDetailsElem.append(historyBarChart);

  const transBarChart = createBalanceBarChartElem(data, 12, true);
  transBarChart.classList.add('balance-chart_wide');
  accDetailsElem.append(transBarChart);

  const transfersHistory = createTransfersHistoryElem(data, true);
  accDetailsElem.append(transfersHistory);

  const backBtn = document.querySelector('.account-details__btn');
  backBtn.addEventListener('click', () => {
    window.location.reload();
  });
}
