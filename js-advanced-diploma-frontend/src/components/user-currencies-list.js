import { el } from 'redom';

export function createUserCurrencies(userCurrencies) {
  const currenciesList = createUserCurrenciesList(userCurrencies);

  const blockWrapper = el(
    'div',
    { class: 'currency__user-currency user-currency' },
    [
      el('h3', {
        class: 'user-currency__title section-title',
        textContent: 'Ваши валюты',
      }),
      currenciesList,
    ]
  );

  return blockWrapper;
}

export function createUserCurrenciesList(userCurrencies) {
  const currenciesList = el('ul', {
    class: 'user-currency__list currency-list',
  });

  const userCurrenciesList = Object.values(userCurrencies);
  for (let i = 0; i < userCurrenciesList.length; i++) {
    if (userCurrenciesList[i].amount === 0) continue;
    const item = el('li', { class: 'currency-list__item' }, [
      el('span', {
        class: 'currency-list__item-name',
        textContent: userCurrenciesList[i].code,
      }),
      el('span', {
        class: 'currency-list__item-value',
        textContent: userCurrenciesList[i].amount.toLocaleString('ru-RU', {
          style: 'decimal',
        }),
      }),
    ]);

    currenciesList.append(item);
  }

  return currenciesList;
}
