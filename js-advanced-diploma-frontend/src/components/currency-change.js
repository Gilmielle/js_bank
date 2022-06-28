import { el } from 'redom';

export function createCurrencyChange() {
  const curChangeList = el('ul', {
    class: 'currency-change__list currency-list',
  });
  const blockWrapper = el(
    'div',
    { class: 'currency__currency-change currency-change' },
    [
      el('h3', {
        class: 'currency-change__title section-title',
        textContent: 'Изменение курсов в реальном времени',
      }),
      curChangeList,
    ]
  );

  let socket = new WebSocket('ws://localhost:3000/currency-feed');

  socket.onmessage = function (event) {
    const socketData = JSON.parse(event.data);
    if (socketData.type !== 'EXCHANGE_RATE_CHANGE') return;

    let postfix = '';
    if (socketData.change === 1) {
      postfix = '_up';
    } else if (socketData.change === -1) {
      postfix = '_down';
    }

    const elements = document.querySelectorAll('.currency-list__item_exchange');
    if (elements.length >= 15) {
      elements[elements.length - 1].remove();
    }
    const item = el(
      'li',
      { class: 'currency-list__item currency-list__item_exchange' },
      [
        el('span', {
          class: `currency-list__item-name currency-list__item-name${postfix}`,
          textContent: `${socketData.from}/${socketData.to}`,
        }),
        el('span', {
          class: `currency-list__item-value currency-list__item-value${postfix}`,
          textContent: socketData.rate.toLocaleString('ru-RU', {
            style: 'decimal',
          }),
        }),
      ]
    );

    curChangeList.prepend(item);
  };

  return blockWrapper;
}
