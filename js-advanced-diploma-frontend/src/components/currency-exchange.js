import { el } from 'redom';
import {
  isExchangeFormValid,
  createValidationMessage,
  clearValidationMessages,
  getFormData,
} from './validations';
import { exchangeCurrency } from './api.js';
import { createUserCurrenciesList } from './user-currencies-list.js';
import success from '../assets/images/success.svg';
import error from '../assets/images/error.svg';

async function makeCurrencyExchange(data, inputs) {
  const result = isExchangeFormValid(data);

  if (result.success.length) {
    for (const successMessages of result.success) {
      createValidationMessage(
        inputs[successMessages],
        inputs[successMessages].parentNode,
        'validation-success',
        success,
        'js-validate-success-icon exchange-js-validate-success-icon'
      );
    }
  }

  if (result.errors.length) {
    const err = new TypeError();
    err.errorMessages = result.errors;
    throw err;
  }

  const response = await exchangeCurrency(data, sessionStorage.userToken);

  if (response.payload !== null) {
    return response.payload;
  }

  if (response.payload === null) {
    const err = new TypeError();
    err.errorMessages = {
      name: 'exchangeErr',
      message: response.error,
    };
    throw err;
  }

  throw new Error('Что-то пошло не так...');
}

function createExchangeForm(currenciesList, spinner) {
  const selectFrom = createCurrencySelect(currenciesList, 'from');
  const selectTo = createCurrencySelect(currenciesList, 'to');

  const exchangeForm = el(
    'form',
    {
      class: 'currency-exchange__form exchange-form',
    },
    [
      el(
        'label',
        {
          class: 'exchange-form__label exchange-form__label_from',
          textContent: 'Из',
        },
        selectFrom
      ),
      el(
        'label',
        {
          class: 'exchange-form__label exchange-form__label_to',
          textContent: 'в',
        },
        selectTo
      ),
      el(
        'label',
        {
          class:
            'exchange-form__label exchange-form__label_amount validate-label',
          textContent: 'Сумма',
        },
        el('input', {
          class: 'exchange-form__input input',
          name: 'amount',
          type: 'text',
        })
      ),
      el('button', {
        class: 'exchange-form__btn btn btn_primary',
        textContent: 'Обменять',
        type: 'submit',
      }),
      el('span', { class: 'js-exchange-error' }),
    ]
  );

  exchangeForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    clearValidationMessages('.js-exchange-error');
    const [data, inputs] = getFormData(exchangeForm);
    const selectFrom = document.querySelector('.exchange-select_from');
    const selectTo = document.querySelector('.exchange-select_to');
    data.from = selectFrom.value;
    data.to = selectTo.value;

    const resultSpan = document.querySelector('.js-exchange-error');
    resultSpan.classList.remove('js-exchange-success');
    const userCurrencyBlock = document.querySelector('.user-currency');
    const userCurrencyList = document.querySelector('.currency-list');

    try {
      spinner.classList.add('spinner_active');
      spinner.querySelector('.spinner__positioner').style = 'top: 70%';

      const result = await makeCurrencyExchange(data, inputs);
      resultSpan.classList.add('js-exchange-success');
      resultSpan.textContent = 'Успешно!';
      userCurrencyList.remove();
      const newCurList = createUserCurrenciesList(result);
      userCurrencyBlock.append(newCurList);
      setTimeout(() => {
        clearValidationMessages('.js-exchange-error');
        for (const key in inputs) {
          inputs[key].value = '';
          inputs[key].classList.remove('validation-success');
        }
        resultSpan.textContent = '';
      }, 1500);
    } catch (err) {
      if (err.name !== 'TypeError') throw err;
      if (err.errorMessages.name === 'exchangeErr') {
        if (err.errorMessages.message === 'Invalid amount') {
          resultSpan.textContent =
            'Не указана сумма перевода или она отрицательная';
        } else if (err.errorMessages.message === 'Not enough currency') {
          resultSpan.textContent = 'На валютном счёте списания нет средств';
        } else if (err.errorMessages.message === 'Overdraft prevented') {
          resultSpan.textContent =
            'Сумма перевода больше, чем доступно на счёте';
        } else {
          resultSpan.textContent = 'Ошибка, попробуйте позже';
        }
      } else if (err.errorMessages) {
        for (const errorMessage of err.errorMessages) {
          createValidationMessage(
            inputs[errorMessage.name],
            inputs[errorMessage.name].parentNode,
            'validation-error',
            error,
            'js-validate-error-icon exchange-js-validate-error-icon',
            errorMessage.message,
            'js-validate-error-span exchange-js-validate-error-span'
          );
        }
      }
    } finally {
      spinner.classList.remove('spinner_active');
      spinner.querySelector('.spinner__positioner').style = 'top: 50%';
    }
  });

  return exchangeForm;
}

function createCurrencySelect(currenciesList, name) {
  const select = el('select', {
    class: `exchange-form__select exchange-select exchange-select_${name}`,
  });

  currenciesList.forEach((currency) => {
    const item = el('option', {
      class: 'exchange-select__option',
      textContent: currency,
      value: currency,
      name: name,
    });
    select.append(item);
  });

  return select;
}

export function createCurrencyExchange(currenciesList, spinner) {
  const exchangeForm = createExchangeForm(currenciesList, spinner);

  const blockWrapper = el(
    'div',
    { class: 'currency__currency-exchange currency-exchange' },
    [
      el('h3', {
        class: 'currency-exchange__title section-title',
        textContent: 'Обмен валюты',
      }),
      exchangeForm,
    ]
  );

  return blockWrapper;
}
