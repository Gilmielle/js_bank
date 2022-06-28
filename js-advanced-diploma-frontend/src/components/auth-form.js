import { el } from 'redom';
import '../styles/auth-form.scss';
import {
  isLogPassValid,
  createValidationMessage,
  clearValidationMessages,
  getFormData,
} from './validations';
import { getUserToken } from './api.js';
import success from '../assets/images/success.svg';
import error from '../assets/images/error.svg';
import * as Choices from 'choices.js';
import '../assets/libs/choices.min.css';

async function loginUser(data, inputs) {
  const result = isLogPassValid(data);

  if (result.success.length) {
    for (const successMessages of result.success) {
      createValidationMessage(
        inputs[successMessages],
        inputs[successMessages].parentNode,
        'validation-success',
        success,
        'js-validate-success-icon'
      );
    }
  }

  if (result.errors.length) {
    const err = new TypeError();
    err.errorMessages = result.errors;
    throw err;
  }

  const response = await getUserToken(data);

  if (response.payload !== null) {
    return response.payload.token;
  }

  if (response.payload === null) {
    const err = new TypeError();
    err.errorMessages = {
      name: 'loginErr',
      message: response.error,
    };
    throw err;
  }

  throw new Error('Что-то пошло не так...');
}

const authForm = el('form', { class: 'auth__form auth-form' }, [
  el('label', { class: 'auth-form__label validate-label' }, [
    el('span', { class: 'auth-form__span', textContent: 'Логин' }),
    el('input', {
      class: 'auth-form__input input',
      type: 'text',
      id: 'login',
      name: 'login',
      placeholder: 'Placeholder',
    }),
  ]),
  el('label', { class: 'auth-form__label validate-label' }, [
    el('span', { class: 'auth-form__span', textContent: 'Пароль' }),
    el('input', {
      class: 'auth-form__input input',
      type: 'password',
      id: 'password',
      name: 'password',
      placeholder: 'Placeholder',
    }),
  ]),
  el('span', { class: 'js-auth-error' }),
  el('button', {
    class: 'auth-form__btn btn btn_primary',
    type: 'submit',
    textContent: 'Войти',
  }),
]);

authForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  clearValidationMessages('.js-auth-error');

  const [data, inputs] = getFormData(authForm);
  let token;
  const spinner = document.querySelector('.spinner');

  try {
    spinner.classList.add('spinner_active');
    token = await loginUser(data, inputs);
    sessionStorage.setItem('userToken', token);
    const authBlock = document.querySelector('.auth');
    authBlock.remove();
    const header = document.querySelector('.header');
    header.classList.remove('header_reduced');
    document.title = 'Банк Coin | Счета';
    import('./card-list.js').then(async (obj) => {
      try {
        spinner.classList.add('spinner_active');
        const cardsBlock = await obj.createCardsBlock();
        window.document.body.append(cardsBlock);
        obj.createCustomSelect(Choices);
      } finally {
        spinner.classList.remove('spinner_active');
      }
    });
  } catch (err) {
    if (err.name !== 'TypeError') throw err;
    if (err.errorMessages.name === 'loginErr') {
      const errSpan = document.querySelector('.js-auth-error');
      if (err.errorMessages.message === 'Invalid password') {
        errSpan.textContent = 'Неверный пароль';
      } else {
        errSpan.textContent = 'Неверный логин';
      }
    } else if (err.errorMessages) {
      for (const errorMessage of err.errorMessages) {
        createValidationMessage(
          inputs[errorMessage.name],
          inputs[errorMessage.name].parentNode,
          'validation-error',
          error,
          'js-validate-error-icon',
          errorMessage.message
        );
      }
    }
  } finally {
    spinner.classList.remove('spinner_active');
  }
});

const authFormBlock = el(
  'div',
  { class: 'auth' },
  el('div', { class: 'auth__wrapper' }, [
    el('h2', { class: 'auth__title', textContent: 'Вход в аккаунт' }),
    authForm,
  ])
);

export default authFormBlock;
