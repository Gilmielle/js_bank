import { el, setChildren } from 'redom';
import { getUserAccounts, createAccount } from './api.js';
import { getDate } from './utils.js';
import '../styles/card-list.scss';
import plus from '../assets/images/plus.svg';

function createCardElement(cardData) {
  let date = 'Транзакций нет';
  if (cardData.transactions.length) {
    date = getDate(cardData.transactions[0].date);
  }

  const cardBtn = el('a', {
    class: 'card__btn btn btn_primary',
    'data-account-id': cardData.account,
    href: 'card-details.html',
    textContent: 'Открыть',
  });

  cardBtn.addEventListener('click', (evt) => {
    const accountId = evt.target.dataset.accountId;
    sessionStorage.setItem('accountId', accountId);
  });

  const cardElem = el('li', { class: 'cards-list__item card' }, [
    el('p', { class: 'card__account', textContent: cardData.account }),
    el('p', {
      class: 'card__balance',
      textContent: `${cardData.balance.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      })}`,
    }),
    el('div', { class: 'card__footer' }, [
      el(
        'p',
        { class: 'card__history', textContent: 'Последняя транзакция:' },
        el('span', { class: 'card__history-date', textContent: date })
      ),
      cardBtn,
    ]),
  ]);

  return cardElem;
}

function createCardsList(userAccounts, cardsWrapper) {
  if (userAccounts === null) {
    const noCardsEl = el('li', {
      class: 'cards-list__item',
      textContent: 'Что-то пошло не так, попробуйте позже',
    });
    cardsWrapper.append(noCardsEl);
  } else {
    userAccounts.forEach((cardData) => {
      const cardElem = createCardElement(cardData);
      cardsWrapper.append(cardElem);
    });
  }
}

async function sortCards(sortValue) {
  const defaultDate = '2000-01-01T00:00:00.786Z';
  const token = sessionStorage.getItem('userToken');
  const userAccounts = await getUserAccounts(token);
  const sortedAccounts = userAccounts.payload
    .slice()
    .sort(function (first, second) {
      let firstElement;
      let secondElement;
      if (sortValue !== 'transactions') {
        firstElement = first[sortValue];
        secondElement = second[sortValue];
      } else {
        if (!first[sortValue][0]) {
          firstElement = defaultDate;
        } else {
          firstElement = first[sortValue][0].date;
        }
        if (!second[sortValue][0]) {
          secondElement = defaultDate;
        } else {
          secondElement = second[sortValue][0].date;
        }
      }
      if (firstElement < secondElement) {
        return -1;
      }
      if (firstElement > secondElement) {
        return 1;
      }
      return 0;
    });
  return sortedAccounts;
}

function createCardsSelect(spinner) {
  const select = el('select', { class: 'cards__select cards-select' });
  const defaultOpt = el('option', {
    class: 'cards-select__option',
    textContent: 'Сортировка',
    value: 'Сортировка',
    selected: true,
    hidden: true,
  });

  const numberOpt = el('option', {
    class: 'cards-select__option',
    textContent: 'По номеру',
    value: 'account',
  });

  const balanceOpt = el('option', {
    class: 'cards-select__option',
    textContent: 'По балансу',
    value: 'balance',
  });

  const transOpt = el('option', {
    class: 'cards-select__option',
    textContent: 'По последней транзакции',
    value: 'transactions',
  });

  setChildren(select, [defaultOpt, numberOpt, balanceOpt, transOpt]);

  select.addEventListener('change', async (evt) => {
    try {
      spinner.classList.add('spinner_active');
      const sortedAccounts = await sortCards(evt.target.value);
      const cardsList = document.querySelector('.cards-list');
      cardsList.textContent = '';
      createCardsList(sortedAccounts, cardsList);
    } finally {
      spinner.classList.remove('spinner_active');
    }
  });

  return select;
}

async function createCardsBlock() {
  const token = sessionStorage.getItem('userToken');
  const spinner = document.querySelector('.spinner');

  const addAcountBtn = el(
    'button',
    {
      class: 'cards__btn btn btn_primary',
    },
    el('img', { class: 'cards__btn-icon', src: plus }),
    el('span', {
      class: 'cards__btn-text',
      textContent: 'Создать новый счёт',
    })
  );

  addAcountBtn.addEventListener('click', async () => {
    try {
      spinner.classList.add('spinner_active');
      await createAccount(token);
      const cardsList = document.querySelector('.cards-list');
      cardsList.textContent = '';
      const userAccounts = await getUserAccounts(token);
      createCardsList(userAccounts.payload, cardsList);
    } finally {
      spinner.classList.remove('spinner_active');
    }
  });

  const select = createCardsSelect(spinner);

  const cardsList = el('ul', { class: 'cards__list cards-list' });

  const cardsBlock = el('div', { class: 'cards container' }, [
    el('div', { class: 'cards__header' }, [
      el('h2', { class: 'cards__title', textContent: 'Ваши счета' }),
      select,
      addAcountBtn,
    ]),
    cardsList,
  ]);

  const userAccounts = await getUserAccounts(token);
  createCardsList(userAccounts.payload, cardsList);

  return cardsBlock;
}

function createCustomSelect(Choices) {
  new Choices('.cards-select', {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
  });

  const choicesItemFirst = document.querySelector(
    '.choices__list--dropdown .choices__item'
  );
  choicesItemFirst.setAttribute('hidden', true);
}

export { createCardsBlock, createCustomSelect };
