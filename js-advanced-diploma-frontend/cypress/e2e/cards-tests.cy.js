/* eslint-disable jest/expect-expect */
/// <reference types='cypress' />

describe('Банк Coin, взаимодействие с картами', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('После логина открывается страница с картами', () => {
    if (!sessionStorage.userToken) {
      cy.contains('Логин').click().type('developer');
      cy.contains('Пароль').click().type('skillbox');
      cy.contains('Войти').click();
    }

    cy.get('.cards').should('exist');
  });

  it('Открываем детальную информацию о счёте', () => {
    cy.get('.cards').should('exist');
    cy.get('.card').eq(0).contains('Открыть').click();
    cy.get('.cards').should('not.exist');
    cy.get('.account-details').should('exist');
  });

  it('Открываем историю баланса', () => {
    cy.get('.card').eq(0).contains('Открыть').click();
    cy.get('.balance-chart').should('have.length', 1).click();
    cy.get('.balance-chart').should('have.length', 2);
    cy.get('.balance-chart').eq(0).should('have.text', 'Динамика баланса');
    cy.get('.balance-chart')
      .eq(1)
      .should('have.text', 'Соотношение входящих исходящих транзакций');
    cy.get('.table-pagination').should('exist');
  });

  it('Пытаемся сделать перевод, неверный номер счёта выдаёт ошибку', () => {
    cy.get('.card').eq(0).contains('Открыть').click();
    cy.contains('Номер счёта получателя').click().type('12');
    cy.contains('Сумма перевода').click().type('1000');
    cy.contains('Отправить').click();
    cy.get('.js-transfer-error').should(
      'have.text',
      'Неверный счёт зачисления'
    );
  });

  it('Пытаемся сделать перевод, сумма больше, чем на счёте выдаёт ошибку', () => {
    cy.get('.card').eq(0).contains('Открыть').click();
    cy.contains('Номер счёта получателя')
      .click()
      .type('61253747452820828268825011');
    cy.contains('Сумма перевода').click().type('10000000000000000');
    cy.contains('Отправить').click();
    cy.get('.js-transfer-error').should(
      'have.text',
      'Сумма перевода больше, чем доступно на счёте'
    );
  });

  it('Перевод с верными данными проходит успешно', () => {
    cy.get('.card').eq(0).contains('Открыть').click();
    cy.contains('Номер счёта получателя')
      .click()
      .type('61253747452820828268825011');
    cy.contains('Сумма перевода').click().type('1000');
    cy.contains('Отправить').click();
    cy.get('.js-transfer-error').should('have.text', 'Успешно!');
  });

  it('Создаём новый счёт и переводим на него деньги, затем переводим деньги с него', () => {
    cy.get('.card')
      .then((array) => {
        return array.length;
      })
      .then((length) => {
        cy.contains('Создать новый счёт').click();
        cy.get('.card').should('have.length', length + 1);
      });

    cy.get('.card')
      .last()
      .find('.card__account')
      .then((elem) => {
        return elem[0].textContent;
      })
      .then((accNum) => {
        cy.get('.card').eq(0).contains('Открыть').click();
        cy.contains('Номер счёта получателя').click().type(accNum);
        cy.contains('Сумма перевода').click().type('1000');
        cy.contains('Отправить').click();
        cy.get('.js-transfer-error').should('have.text', 'Успешно!');

        cy.contains('Вернуться назад').click();
        cy.get('.card').last().contains('Открыть').click();
        cy.contains('Номер счёта получателя')
          .click()
          .type('74213041477477406320783754');
        cy.contains('Сумма перевода').click().type('1000');
        cy.contains('Отправить').click();
        cy.get('.js-transfer-error').should('have.text', 'Успешно!');
      });
  });
});
