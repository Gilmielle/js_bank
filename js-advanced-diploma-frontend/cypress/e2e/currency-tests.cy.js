/* eslint-disable jest/expect-expect */
/// <reference types='cypress' />

describe('Банк Coin, взаимодействие с картами', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('После логина открывается страница с картами, переходим на страницу с валютами', () => {
    if (!sessionStorage.userToken) {
      cy.contains('Логин').click().type('developer');
      cy.contains('Пароль').click().type('skillbox');
      cy.contains('Войти').click();
    }

    cy.get('.cards').should('exist');
    cy.contains('Валюта').click();
    cy.get('.cards').should('not.exist');
    cy.get('.currency').should('exist');
  });

  it('Обмен валюты проходит успешно', () => {
    cy.contains('Валюта').click();
    cy.get('.exchange-form').contains('Из').click().contains('RUB').click();
    cy.get('.exchange-form').contains('в').click().contains('BTC').click();
    cy.get('.exchange-form').contains('Сумма').click().type('1000');
    cy.get('.exchange-form').contains('Обменять').click();
    cy.get('.js-exchange-error').should('have.text', 'Успешно!');
  });
});
