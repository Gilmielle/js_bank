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
