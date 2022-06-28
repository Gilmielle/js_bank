export async function getUserToken(data) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  return response;
}

export async function getUserAccounts(token) {
  const accounts = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  return accounts;
}

export async function getAccountDetails(token, id) {
  const accounts = await fetch(`http://localhost:3000/account/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  return accounts;
}

export async function createAccount(token) {
  const result = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  return result;
}

export async function transferFunds(data, accountFrom, token) {
  const { to, amount } = data;
  const clientData = {
    from: accountFrom,
    to,
    amount,
  };
  const result = await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(clientData),
  }).then((res) => res.json());
  return result;
}

export async function getBankCoords() {
  const result = await fetch('http://localhost:3000/banks').then((res) =>
    res.json()
  );
  return result;
}

export async function getUserCurrencies(token) {
  const currencies = await fetch('http://localhost:3000/currencies', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  return currencies;
}

export async function getAllCurrencies() {
  const result = await fetch('http://localhost:3000/all-currencies').then(
    (res) => res.json()
  );
  return result;
}

export async function exchangeCurrency(data, token) {
  const result = await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
  return result;
}
