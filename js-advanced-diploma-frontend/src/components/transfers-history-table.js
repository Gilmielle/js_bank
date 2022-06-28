import { el } from 'redom';
import { getShortDate } from './utils.js';
import Pagination from 'tui-pagination';

function createTableDraft() {
  const table = el(
    'table',
    { class: 'transfer-history__table transfer-table' },
    [
      el('col', { class: 'transfer-table__from' }),
      el('col', { class: 'transfer-table__to' }),
      el('col', { class: 'transfer-table__sum' }),
      el('col', { class: 'transfer-table__date' }),
      el('thead', { class: 'transfer-table__head' }, [
        el('tr', { class: 'transfer-table__head-row' }, [
          el('th', {
            class: 'transfer-table__head-cell',
            textContent: 'Счёт отправителя',
          }),
          el('th', {
            class: 'transfer-table__head-cell',
            textContent: 'Счёт получателя',
          }),
          el('th', {
            class: 'transfer-table__head-cell',
            textContent: 'Сумма',
          }),
          el('th', {
            class: 'transfer-table__head-cell',
            textContent: 'Дата',
          }),
        ]),
      ]),
    ]
  );

  return table;
}

function createTableBody(transactionsArr, accountNum, dataTarget = null) {
  const tableBodyWrapper = el('tbody', { class: 'transfer-table__body' });
  if (dataTarget) {
    tableBodyWrapper.dataset.target = dataTarget;
  }
  transactionsArr.forEach((transaction) => {
    const tableRow = createTableRow(transaction, accountNum);
    tableBodyWrapper.append(tableRow);
  });

  return tableBodyWrapper;
}

function createTableRow(transaction, accountNum) {
  const [sumClass, sumSign] =
    transaction.to === accountNum
      ? ['transfer-plus', '+']
      : ['transfer-minus', '-'];
  const row = el('tr', { class: 'transfer-table__row' }, [
    el('td', { class: 'transfer-table__cell', textContent: transaction.from }),
    el('td', { class: 'transfer-table__cell', textContent: transaction.to }),
    el('td', {
      class: `transfer-table__cell ${sumClass}`,
      textContent: `${sumSign} ${transaction.amount.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      })}`,
    }),
    el('td', {
      class: 'transfer-table__cell',
      textContent: getShortDate(transaction.date),
    }),
  ]);

  return row;
}

function createTablePagination(arr, accountNum, table) {
  const pagination = el('ul', {
    class:
      'transfer-table__pagination table-pagination tui-pagination-container',
  });

  const myPagination = new Pagination(pagination, {
    // Total number of items
    totalItems: arr.length,
    // Items per page
    itemsPerPage: 1,
    // Visible pages
    visiblePages: 10,
    // Current page
    page: 1,
    // center aligned
    centerAlign: false,
    // default classes
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<button class="table-pagination__btn btn btn_primary">{{page}}</button>',
      currentPage:
        '<button class="table-pagination__btn table-pagination__btn_active btn btn_primary">{{page}}</button>',
      moveButton: (type) => {
        let text = getPaginationTypeText(type);

        let template =
          '<button class="table-pagination__btn btn btn_primary">' +
          text +
          '</button>';

        return template;
      },
      disabledMoveButton: (type) => {
        let text = getPaginationTypeText(type);

        let template =
          '<button class="table-pagination__btn btn btn_primary" disabled>' +
          text +
          '</button>';

        return template;
      },
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip table-pagination__btn btn btn_primary">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  });

  myPagination.on('afterMove', (event) => {
    const currentPage = event.page;
    const target = document.querySelector(`[data-target="${currentPage}"]`);

    document
      .querySelectorAll('.transfer-table__body_active')
      .forEach((tbody) => {
        tbody.classList.remove('transfer-table__body_active');
      });

    if (!target) {
      const tableBody = createTableBody(
        arr[currentPage - 1],
        accountNum,
        currentPage
      );
      tableBody.classList.add('transfer-table__body_active');
      table.append(tableBody);
    } else {
      target.classList.add('transfer-table__body_active');
    }
  });

  return pagination;
}

function getPaginationTypeText(type) {
  let text;

  if (type.type === 'first') {
    text = 'Первая';
  } else if (type.type === 'last') {
    text = 'Последняя';
  } else if (type.type === 'prev') {
    text = 'Предыдущая';
  } else if (type.type === 'next') {
    text = 'Следующая';
  }

  return text;
}

export function createFullHistoryTable(transactionsArr, accountNum) {
  let structuredArr = [];
  let reversedTranactions = transactionsArr.reverse();
  for (let i = 0; i < reversedTranactions.length; i = i + 25) {
    let elem = reversedTranactions.slice(i, i + 25);
    structuredArr.push(elem);
  }

  const table = createTableDraft();
  const tableBody = createTableBody(structuredArr[0], accountNum, 1);
  tableBody.classList.add('transfer-table__body_active');
  table.append(tableBody);

  const pagination = createTablePagination(structuredArr, accountNum, table);

  return {
    table,
    pagination,
  };
}

export function createHistoryTable(transactionsArr, accountNum) {
  const lastTenTransactions = transactionsArr
    .slice(transactionsArr.length - 10)
    .reverse();

  const tableBody = createTableBody(lastTenTransactions, accountNum);
  tableBody.classList.add('transfer-table__body_active');
  const table = createTableDraft();
  table.append(tableBody);

  return table;
}

export function createTransfersHistoryElem(data, full = false) {
  let table;
  let pagination;
  if (!data.transactions.length) {
    table = el('p', {
      class: 'transfer-history__table_empty',
      textContent: 'История переводов пока пуста',
    });
  } else {
    if (full && data.transactions.length > 26) {
      const result = createFullHistoryTable(data.transactions, data.account);
      table = result.table;
      pagination = result.pagination;
    } else {
      table = createHistoryTable(data.transactions, data.account);
    }
  }
  const transferHistoryWrapper = el(
    'section',
    { class: 'account-details__transfer-history transfer-history' },
    [
      el('h2', {
        class: 'transfer-history__title section-title',
        textContent: 'История переводов',
      }),
      table,
    ]
  );
  if (pagination) {
    transferHistoryWrapper.append(pagination);
  }

  return transferHistoryWrapper;
}
