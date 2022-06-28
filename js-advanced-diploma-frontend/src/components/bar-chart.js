import { el } from 'redom';
import Chart from 'chart.js/auto';
import {
  getPrevMonth,
  getNextMonth,
  getSuggestedMax,
  getSuggestedStackedMax,
  getTransactionsMax,
  getLabelsArray,
  getPeriodStartString,
} from './bar-chart-helpers.js';

function getFullBalanceHistory(userData) {
  const userAcc = userData.account;
  let balance = 0;
  const balanceHistory = {};
  let currentMonth = userData.transactions[0].date.slice(0, 7);

  userData.transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7);
    if (month !== currentMonth) {
      balanceHistory[currentMonth] = Number(balance).toFixed(2);
      currentMonth = month;
    }
    if (transaction.to === userAcc) {
      balance = balance + transaction.amount;
    } else {
      balance = balance - transaction.amount;
    }
  });
  balanceHistory[currentMonth] = Number(balance).toFixed(2);

  return balanceHistory;
}

function getFixedPeriodHistory(userData, periodStart, monthQuantity) {
  const balanceHistory = {};

  for (let i = 0; i < monthQuantity; i++) {
    let value;
    if (!userData[periodStart]) {
      let prevMonth = periodStart;
      let i = 0;
      while (!userData[prevMonth] && i !== Object.keys(userData).length) {
        prevMonth = getPrevMonth(prevMonth);
        i++;
      }
      value = userData[prevMonth];
      if (!value) {
        value = 0;
      }
    } else {
      value = userData[periodStart];
    }
    balanceHistory[periodStart] = value;
    periodStart = getNextMonth(periodStart);
  }

  return balanceHistory;
}

function createBarChart(userDataObj) {
  const barChart = el('canvas', {
    class: 'balance-chart__bar-chart bar-chart',
  });

  const max = getSuggestedMax(userDataObj);
  const labels = getLabelsArray(userDataObj);

  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: '#116ACC',
        data: Object.values(userDataObj),
        max,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
            drawTicks: false,
            tickLength: 0,
          },
        },
        y: {
          position: 'right',
          suggestedMax: max,
          max: max,
          grid: {
            drawOnChartArea: false,
            tickLength: 0,
          },
          ticks: {
            stepSize: max,
          },
        },
      },
    },
  };

  new Chart(barChart, config);

  return barChart;
}

function getFullTransactionsHistory(userData) {
  const userAcc = userData.account;
  let transIn = 0;
  let transOut = 0;
  const transHistory = {
    in: {},
    out: {},
  };
  let currentMonth = userData.transactions[0].date.slice(0, 7);

  userData.transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7);
    if (month !== currentMonth) {
      transHistory.in[currentMonth] = Number(transIn).toFixed(2);
      transHistory.out[currentMonth] = Number(transOut).toFixed(2);
      currentMonth = month;
      transIn = 0;
      transOut = 0;
    }
    if (transaction.to === userAcc) {
      transIn = transIn + transaction.amount;
    } else {
      transOut = transOut + transaction.amount;
    }
  });
  transHistory.in[currentMonth] = Number(transIn).toFixed(2);
  transHistory.out[currentMonth] = Number(transOut).toFixed(2);

  return transHistory;
}

function getFixedPeriodTransHistory(userData, periodStart, monthQuantity) {
  const transHistory = {
    in: {},
    out: {},
  };

  for (let i = 0; i < monthQuantity; i++) {
    transHistory.in[periodStart] = userData.in[periodStart];
    transHistory.out[periodStart] = userData.out[periodStart];
    if (!userData.in[periodStart]) {
      transHistory.in[periodStart] = '0.00';
    }
    if (!userData.out[periodStart]) {
      transHistory.out[periodStart] = '0.00';
    }
    periodStart = getNextMonth(periodStart);
  }

  return transHistory;
}

function createStackedBarChart(userDataObj) {
  const barChart = el('canvas', {
    class: 'balance-chart__bar-chart bar-chart',
  });

  const max = getSuggestedStackedMax(userDataObj);
  const labels = getLabelsArray(userDataObj.in);
  const tick = getTransactionsMax(userDataObj);
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: '#FD4E5D',
        data: Object.values(userDataObj.out),
        max,
      },
      {
        backgroundColor: '#76CA66',
        data: Object.values(userDataObj.in),
        max,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            drawOnChartArea: false,
            drawTicks: false,
            tickLength: 0,
          },
        },
        y: {
          stacked: true,
          position: 'right',
          suggestedMax: max,
          max: max,
          grid: {
            drawOnChartArea: false,
            tickLength: 0,
          },
          ticks: {
            stepSize: tick,
          },
        },
      },
    },
  };

  new Chart(barChart, config);

  return barChart;
}

export function createBalanceBarChart(data, monthQuantity, stacked = false) {
  let barChart;
  if (!data.transactions.length) {
    let text = '';
    if (stacked) {
      text = 'История соотношения входящих и исходящих транзакций пока пуста';
    } else {
      text = 'История динамики баланса пока пуста';
    }
    barChart = el('p', {
      class: 'bar-chart_empty',
      textContent: text,
    });
  } else {
    if (stacked) {
      const fullTransHistory = getFullTransactionsHistory(data);
      let periodStart = getPeriodStartString(monthQuantity);
      const transHistory = getFixedPeriodTransHistory(
        fullTransHistory,
        periodStart,
        monthQuantity
      );
      barChart = createStackedBarChart(transHistory);
    } else {
      const fullBalanceHistory = getFullBalanceHistory(data);
      let periodStart = getPeriodStartString(monthQuantity);
      const balanceHistory = getFixedPeriodHistory(
        fullBalanceHistory,
        periodStart,
        monthQuantity
      );
      barChart = createBarChart(balanceHistory);
    }
  }

  return barChart;
}

export function createBalanceBarChartElem(
  data,
  monthQuantity,
  stacked = false
) {
  let barChartWrapper;
  const barChart = createBalanceBarChart(data, monthQuantity, stacked);
  let title;
  if (stacked) {
    title = 'Соотношение входящих исходящих транзакций';
  } else {
    title = 'Динамика баланса';
  }
  barChartWrapper = el(
    'section',
    { class: 'account-details__balance-chart balance-chart' },
    [
      el('h2', {
        class: 'balance-chart__title section-title',
        textContent: title,
      }),
      el('div', { class: 'balance-chart__wrapper' }, barChart),
    ]
  );

  return barChartWrapper;
}
