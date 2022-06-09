import { isLogPassValid } from '../src/components/validations';

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
