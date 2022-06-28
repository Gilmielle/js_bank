import { el } from 'redom';

export function isLogPassValid(data) {
  const result = {
    errors: [],
    success: [],
  };
  const { login, password } = data;

  if (!login) {
    result.errors.push({
      name: 'login',
      message: 'Логин обязателен для заполнения',
    });
  } else if (login.length < 6) {
    result.errors.push({
      name: 'login',
      message: 'Длина логина менее 6 символов',
    });
  } else if (login.includes(' ')) {
    result.errors.push({
      name: 'login',
      message: 'В логине не должно быть пробелов',
    });
  } else {
    result.success.push('login');
  }

  if (!password) {
    result.errors.push({
      name: 'password',
      message: 'Пароль обязателен для заполнения',
    });
  } else if (password.length < 6) {
    result.errors.push({
      name: 'password',
      message: 'Длина пароля менее 6 символов',
    });
  } else if (password.includes(' ')) {
    result.errors.push({
      name: 'password',
      message: 'В пароле не должно быть пробелов',
    });
  } else {
    result.success.push('password');
  }

  return result;
}

export function createValidationMessage(
  elem,
  parent,
  validationClass,
  validationImg,
  validationImgClass,
  validationErrorText = '',
  validationMessageClass = 'js-validate-error-span'
) {
  elem.classList.add(validationClass);
  const validationLabel = el('span', { class: 'js-validate-label' }, [
    el('img', { class: validationImgClass, src: validationImg }),
  ]);
  if (validationClass === 'validation-error') {
    const validationMessage = el('span', {
      class: validationMessageClass,
      textContent: validationErrorText,
    });
    validationLabel.append(validationMessage);
  }
  parent.append(validationLabel);
}

export function clearValidationMessages(errSpanClass) {
  const validationLabels = document.querySelectorAll('.js-validate-label');
  validationLabels.forEach((label) => label.remove());
  const errSpan = document.querySelector(errSpanClass);
  errSpan.textContent = '';
}

export function getFormData(form) {
  const data = {};
  const inputs = {};

  for (let i = 0; i < form.elements.length; ++i) {
    const input = form.elements[i];
    if (!input.name) continue;
    data[input.name] = input.value;
    inputs[input.name] = input;
    input.classList.remove('validation-error');
    input.classList.remove('validation-success');
  }

  return [data, inputs];
}

export function isTransferFormValid(data) {
  const result = {
    errors: [],
    success: [],
  };
  const { to, amount } = data;

  if (!to) {
    result.errors.push({
      name: 'to',
      message: 'Поле обязательно для заполнения',
    });
  } else if (/[^\d]/i.test(to)) {
    result.errors.push({
      name: 'to',
      message: 'Разрешены только цифры',
    });
  } else {
    result.success.push('to');
  }

  if (!amount) {
    result.errors.push({
      name: 'amount',
      message: 'Поле обязательно для заполнения',
    });
  } else if (amount.includes('-')) {
    result.errors.push({
      name: 'amount',
      message: 'Сумма не может быть отрицательной',
    });
  } else if (/[^\d.,]/i.test(amount)) {
    result.errors.push({
      name: 'amount',
      message: 'Присутствуют лишние символы',
    });
  } else {
    result.success.push('amount');
  }

  return result;
}

export function isExchangeFormValid(data) {
  const result = {
    errors: [],
    success: [],
  };
  const { amount } = data;

  if (!amount) {
    result.errors.push({
      name: 'amount',
      message: 'Поле обязательно для заполнения',
    });
  } else if (amount.includes('-')) {
    result.errors.push({
      name: 'amount',
      message: 'Сумма не может быть отрицательной',
    });
  } else if (/[^\d.,]/i.test(amount)) {
    result.errors.push({
      name: 'amount',
      message: 'Присутствуют лишние символы',
    });
  } else {
    result.success.push('amount');
  }

  return result;
}
