import { el } from 'redom';

export const monthArray = {
  '01': 'Январь',
  '02': 'Февраль',
  '03': 'Март',
  '04': 'Апрель',
  '05': 'Май',
  '06': 'Июнь',
  '07': 'Июль',
  '08': 'Август',
  '09': 'Сентябрь',
  10: 'Открябрь',
  11: 'Ноябрь',
  12: 'Декабрь',
};

export function getDate(dateString) {
  const monthArray = {
    '01': 'января',
    '02': 'февраля',
    '03': 'марта',
    '04': 'апреля',
    '05': 'мая',
    '06': 'июня',
    '07': 'июля',
    '08': 'августа',
    '09': 'сентября',
    10: 'открября',
    11: 'ноября',
    12: 'декабря',
  };

  const date = dateString.split('T');
  const [year, month, day] = date[0].split('-');
  const dateFormatted = `${day} ${monthArray[month]} ${year}`;

  return dateFormatted;
}

export function getShortDate(dateString) {
  const date = dateString.split('T');
  const [year, month, day] = date[0].split('-');
  return `${day}.${month}.${year}`;
}

export function createErrorMsg() {
  const msg = el('div', {
    class: 'container',
    style: 'padding-top: 50px; text-align: center; font-size: 2em',
    textContent: 'Произошла ошибка, попробуйте позже',
  });

  return msg;
}
