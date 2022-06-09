import { el } from 'redom';
import '../styles/auth-form.scss';
import { isLogPassValid } from './validations';
import success from '../assets/images/success.svg';
import error from '../assets/images/error.svg';

function createValidationMessage(
  elem,
  validationClass,
  validationImg,
  validationImgClass,
  validationErrorText = ''
) {
  elem.classList.add(validationClass);
  const inputLabel = elem.parentNode;
  const validationLabel = el('span', { class: 'js-validate-label' }, [
    el('img', { class: validationImgClass, src: validationImg }),
  ]);
  if (validationClass === 'validation-error') {
    const validationMessage = el('span', {
      class: 'js-validate-error-span',
      textContent: validationErrorText,
    });
    validationLabel.append(validationMessage);
  }
  inputLabel.append(validationLabel);
}

async function loginUser(data, inputs) {
  const result = isLogPassValid(data);

  if (result.success.length) {
    for (let i = 0; i < result.success.length; i++) {
      createValidationMessage(
        inputs[result.success[i]],
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

  console.log(data);

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.json());
  console.log(response);

  if (response.payload !== null) {
    return response.token;
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
    textContent: 'Войти',
  }),
]);

authForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const validationLabels = document.querySelectorAll('.js-validate-label');
  validationLabels.forEach((label) => label.remove());
  const errSpan = document.querySelector('.js-auth-error');
  errSpan.textContent = '';
  const data = {};
  const inputs = {};
  let token;

  for (let i = 0; i < authForm.elements.length; ++i) {
    const input = authForm.elements[i];
    if (!input.name) continue;
    data[input.name] = input.value.trim();
    inputs[input.name] = input;
    input.classList.remove('validation-error');
    input.classList.remove('validation-success');
  }

  try {
    token = await loginUser(data, inputs);
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
          'validation-error',
          error,
          'js-validate-error-icon',
          errorMessage.message
        );
      }
    }
  }

  return token;
});

const authFormBlock = el('div', { class: 'auth' }, [
  el('h2', { class: 'auth__title', textContent: 'Вход в аккаунт' }),
  authForm,
]);

export default authFormBlock;
