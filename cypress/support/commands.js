// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("visitAsUser", (...args) => {
  cy.setCookie("next-auth.session-token", "test-token").then(() => {
    cy.visit(...args)
  })
})

Cypress.Commands.add("visitAsApprover", (...args) => {
  cy.setCookie("next-auth.session-token", "test-approver-token").then(() => {
    cy.visit(...args)
  })
})

Cypress.Commands.add("visitAsPanelApprover", (...args) => {
  cy.setCookie("next-auth.session-token", "test-panel-approver-token").then(() => {
    cy.visit(...args)
  })
})
