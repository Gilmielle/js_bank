import { el } from 'redom';
import {
  isTransferFormValid,
  createValidationMessage,
  clearValidationMessages,
  getFormData,
} from './validations';
import { createHistoryTable } from './transfers-history-table.js';
import { createBalanceBarChart } from './bar-chart.js';
import { transferFunds } from './api.js';
import mail from '../assets/images/mail.svg';
import success from '../assets/images/success.svg';
import error from '../assets/images/error.svg';

function rememberTransferAccount(newAcc) {
  const key = sessionStorage.userToken;
  if (localStorage[key]) {
    const previousAccountsArr = localStorage[key].split(',');
    const sameElem = previousAccountsArr.filter(
      (account) => account === newAcc
    );
    if (sameElem.length === 0) {
      previousAccountsArr.push(newAcc);
      localStorage.setItem(key, previousAccountsArr);
    }
  } else {
    localStorage.setItem(key, newAcc);
  }
}

async function makeMoneyTransfer(data, inputs, accountFrom) {
  const result = isTransferFormValid(data);

  if (result.success.length) {
    for (const successMessages of result.success) {
      let parent = inputs[successMessages].previousElementSibling;
      if (successMessages === 'to') {
        parent = inputs[successMessages].parentNode.previousElementSibling;
      }
      createValidationMessage(
        inputs[successMessages],
        parent,
        'validation-success',
        success,
        'js-validate-success-icon funds-js-validate-success-icon'
      );
    }
  }

  if (result.errors.length) {
    const err = new TypeError();
    err.errorMessages = result.errors;
    throw err;
  }

  const response = await transferFunds(
    data,
    accountFrom,
    sessionStorage.userToken
  );

  if (response.payload !== null) {
    rememberTransferAccount(data.to);
    return response.payload;
  }

  if (response.payload === null) {
    const err = new TypeError();
    err.errorMessages = {
      name: 'transferErr',
      message: response.error,
    };
    throw err;
  }

  throw new Error('Что-то пошло не так...');
}

function updateAccPageData(data) {
  const balanceElem = document.querySelector('.account-details__balance-sum');
  balanceElem.textContent = data.balance.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });

  const transferHistoryElem = document.querySelector('.transfer-history');
  const transferTableElem = document.querySelector('.transfer-table');
  transferTableElem.remove();
  const newTable = createHistoryTable(
    data.transactions,
    sessionStorage.accountId
  );
  transferHistoryElem.append(newTable);

  const balanceBarChartElem = document.querySelector('.balance-chart__wrapper');
  const barChartElem = document.querySelector('.bar-chart');
  barChartElem.remove();
  const newBarChart = createBalanceBarChart(data, 6);
  balanceBarChartElem.append(newBarChart);
}

export default function createMoneyTransferForm(accountFrom, spinner) {
  const formElem = el(
    'form',
    {
      class: 'money-transfer__form transfer-form',
      autocomplete: 'off',
    },
    [
      el('label', {
        class: 'transfer-form__label validate-label',
        textContent: 'Номер счёта получателя',
        for: 'account-to',
      }),
      el(
        'div',
        { class: 'transfer-form__autocomplete autocomplete' },
        el('input', {
          class: 'transfer-form__input input',
          type: 'text',
          id: 'account-to',
          name: 'to',
          placeholder: 'Placeholder',
        })
      ),
      el('label', {
        class: 'transfer-form__label validate-label',
        textContent: 'Сумма перевода',
        for: 'amount',
      }),
      el('input', {
        class: 'transfer-form__input input',
        type: 'text',
        id: 'amount',
        name: 'amount',
        placeholder: 'Placeholder',
      }),
      el(
        'button',
        { class: 'transfer-form__btn btn btn_primary', type: 'submit' },
        [
          el('img', { class: 'transfer-form__btn-icon', src: mail }),
          el('span', {
            class: 'transfer-form__btn-text',
            textContent: 'Отправить',
          }),
        ]
      ),
      el('span', { class: 'js-transfer-error' }),
    ]
  );

  formElem.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    clearValidationMessages('.js-transfer-error');
    const [data, inputs] = getFormData(formElem);
    const resultSpan = document.querySelector('.js-transfer-error');
    resultSpan.classList.remove('js-transfer-success');

    try {
      spinner.classList.add('spinner_active');
      spinner.querySelector('.spinner__positioner').style = 'top: 30%';

      const result = await makeMoneyTransfer(data, inputs, accountFrom);
      resultSpan.classList.add('js-transfer-success');
      resultSpan.textContent = 'Успешно!';
      updateAccPageData(result);
      setTimeout(() => {
        clearValidationMessages('.js-transfer-error');
        for (const key in inputs) {
          inputs[key].value = '';
          inputs[key].classList.remove('validation-success');
        }
        resultSpan.textContent = '';
      }, 1500);
    } catch (err) {
      if (err.name !== 'TypeError') throw err;
      if (err.errorMessages.name === 'transferErr') {
        if (err.errorMessages.message === 'Invalid account to') {
          resultSpan.textContent = 'Неверный счёт зачисления';
        } else if (err.errorMessages.message === 'Overdraft prevented') {
          resultSpan.textContent =
            'Сумма перевода больше, чем доступно на счёте';
        } else {
          resultSpan.textContent = 'Ошибка, попробуйте позже';
        }
      } else if (err.errorMessages) {
        for (const errorMessage of err.errorMessages) {
          let parent = inputs[errorMessage.name].previousElementSibling;
          if (errorMessage.name === 'to') {
            parent =
              inputs[errorMessage.name].parentNode.previousElementSibling;
          }
          createValidationMessage(
            inputs[errorMessage.name],
            parent,
            'validation-error',
            error,
            'js-validate-error-icon funds-js-validate-error-icon',
            errorMessage.message,
            'js-validate-error-span funds-js-validate-error-span'
          );
        }
      }
    } finally {
      spinner.classList.remove('spinner_active');
      spinner.querySelector('.spinner__positioner').style = 'top: 50%';
    }
  });

  const formWrapper = el(
    'section',
    { class: 'account-details__money-transfer money-transfer' },
    [
      el('h2', {
        class: 'money-transfer__title section-title',
        textContent: 'Новый перевод',
      }),
      formElem,
    ]
  );

  return formWrapper;
}
