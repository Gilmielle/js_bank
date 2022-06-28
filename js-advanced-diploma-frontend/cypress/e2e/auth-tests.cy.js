/* eslint-disable jest/expect-expect */
/// <reference types='cypress' />

describe('Банк Coin, форма авторизации', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Ввод неверного логина выдаёт ошибку', () => {
    if (sessionStorage.userToken) {
      cy.contains('Выйти').click();
    }
    cy.contains('Логин').click().type('developerrrr');
    cy.contains('Пароль').click().type('skillbox');
    cy.contains('Войти').click();
    cy.get('.js-auth-error').should('have.text', 'Неверный логин');
  });

  it('Ввод неверного пароля выдаёт ошибку', () => {
    cy.contains('Логин').click().type('developer');
    cy.contains('Пароль').click().type('skillboxxxx');
    cy.contains('Войти').click();
    cy.get('.js-auth-error').should('have.text', 'Неверный пароль');
  });

  it('Логин проходит успешно, открывается страница с картами', () => {
    cy.contains('Логин').click().type('developer');
    cy.contains('Пароль').click().type('skillbox');
    cy.contains('Войти').click();
    cy.get('.auth').should('not.exist');
    cy.get('.cards').should('exist');
  });

  it('После перезагрузки страницы не происходит разлогина', () => {
    cy.reload();
    cy.get('.auth').should('not.exist');
    cy.get('.cards').should('exist');
  });

  it('При нажатии на кнопку выйти происходит разлогин и снова открывается форма авторизации', () => {
    cy.contains('Выйти').click();
    cy.get('.cards').should('not.exist');
    cy.get('.auth').should('exist');
  });
});
