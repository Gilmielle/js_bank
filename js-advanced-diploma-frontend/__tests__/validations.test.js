import {
  isLogPassValid,
  isTransferFormValid,
  isExchangeFormValid,
} from '../src/components/validations';

test('Валидация незаполненных логина и пароля выдаёт ошибку', () => {
  const logData = {
    login: '',
    password: '',
  };
  const result = isLogPassValid(logData);
  expect(result.errors[0].message).toBe('Логин обязателен для заполнения');
  expect(result.errors[1].message).toBe('Пароль обязателен для заполнения');
  expect(result.success.length).toBe(0);
});

test('Валидация логина и пароля короче 6 символов выдаёт ошибку', () => {
  const logData = {
    login: 'admin',
    password: 'admin',
  };
  const result = isLogPassValid(logData);
  expect(result.errors[0].message).toBe('Длина логина менее 6 символов');
  expect(result.errors[1].message).toBe('Длина пароля менее 6 символов');
  expect(result.success.length).toBe(0);
});

test('Валидация логина и пароля c пробелами выдаёт ошибку', () => {
  const logData = {
    login: 'ad min',
    password: 'a dmin',
  };
  const result = isLogPassValid(logData);
  expect(result.errors[0].message).toBe('В логине не должно быть пробелов');
  expect(result.errors[1].message).toBe('В пароле не должно быть пробелов');
  expect(result.success.length).toBe(0);
});

test('Корректные логин и пароль проходят проверку', () => {
  const logData = {
    login: 'developer',
    password: 'skillbox',
  };
  const result = isLogPassValid(logData);
  expect(result.errors.length).toBe(0);
  expect(result.success.length).toBe(2);
  expect(result.success[0]).toBe('login');
  expect(result.success[1]).toBe('password');
});

test('Валидация незаполненного счёта выдаёт ошибку', () => {
  const logData = {
    to: '',
    amount: '123',
  };
  const result = isTransferFormValid(logData);
  expect(result.errors[0].message).toBe('Поле обязательно для заполнения');
  expect(result.success.length).toBe(1);
});

test('Валидация незаполненной суммы выдаёт ошибку (перевод денег)', () => {
  const logData = {
    to: '123',
    amount: '',
  };
  const result = isTransferFormValid(logData);
  expect(result.errors[0].message).toBe('Поле обязательно для заполнения');
  expect(result.success.length).toBe(1);
});

test('Валидация отрицательной суммы выдаёт ошибку (перевод денег)', () => {
  const logData = {
    to: '123',
    amount: '-123',
  };
  const result = isTransferFormValid(logData);
  expect(result.errors[0].message).toBe('Сумма не может быть отрицательной');
  expect(result.success.length).toBe(1);
});

test('Валидация счёта с лишними символами выдаёт ошибку', () => {
  const logData = {
    to: '123sdfs34',
    amount: '123',
  };
  const result = isTransferFormValid(logData);
  expect(result.errors[0].message).toBe('Разрешены только цифры');
  expect(result.success.length).toBe(1);
});

test('Валидация суммы с лишними символами выдаёт ошибку (перевод денег)', () => {
  const logData = {
    to: '123',
    amount: '+123sdfg',
  };
  const result = isTransferFormValid(logData);
  expect(result.errors[0].message).toBe('Присутствуют лишние символы');
  expect(result.success.length).toBe(1);
});

test('Валидация корректно заполненной формы проходит проверку (перевод денег)', () => {
  const logData = {
    to: '123',
    amount: '123',
  };
  const result = isTransferFormValid(logData);
  expect(result.success.length).toBe(2);
});

test('Валидация незаполненной суммы выдаёт ошибку (обмен валюты)', () => {
  const logData = {
    from: 'ETH',
    to: 'BTC',
    amount: '',
  };
  const result = isExchangeFormValid(logData);
  expect(result.errors[0].message).toBe('Поле обязательно для заполнения');
  expect(result.success.length).toBe(0);
});

test('Валидация отрицательной суммы выдаёт ошибку (обмен валюты)', () => {
  const logData = {
    from: 'ETH',
    to: 'BTC',
    amount: '-123',
  };
  const result = isExchangeFormValid(logData);
  expect(result.errors[0].message).toBe('Сумма не может быть отрицательной');
  expect(result.success.length).toBe(0);
});

test('Валидация суммы с лишними символами выдаёт ошибку (обмен валюты)', () => {
  const logData = {
    from: 'ETH',
    to: 'BTC',
    amount: '+123sdfg',
  };
  const result = isExchangeFormValid(logData);
  expect(result.errors[0].message).toBe('Присутствуют лишние символы');
  expect(result.success.length).toBe(0);
});

test('Валидация корректной суммы проходит проверку (обмен валюты)', () => {
  const logData = {
    from: 'ETH',
    to: 'BTC',
    amount: '12',
  };
  const result = isExchangeFormValid(logData);
  expect(result.success.length).toBe(1);
});
