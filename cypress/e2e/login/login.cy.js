import CommonHelper from "../../support/commonHelper"
describe('Given login page', () => {
    let userEmail = Cypress.env("userEmail")
    let userPassword = Cypress.env("userPassword")
    beforeEach(() => {
        cy.visit('/login')
    })
    it('should verify if user can log in', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        const user_name = 'Pael'
        CommonHelper.verifyToastModal('login successful')
        verifyUserNameIsCorrectlyDisplayedInHeader(user_name)

    })

    it('should logout user', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.Logout()
        ensureAuthInputsAreVisible()

    })

    it.skip('should verify that user cant log in with wrong password', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it('should verify that user cant log in with wrong email', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it('should verify that user admin user can log in', () => {
        CommonHelper.LogIn(Cypress.env("adminEmail"), Cypress.env("adminPassword"))
        CommonHelper.verifyToastModal('login successful')
        verifyAdminButtonInHeader()
    })

    it('should keep user loggedf after page refresh', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        cy.reload()
        verifyUserNameIsCorrectlyDisplayedInHeader('Pael')
    })
})


function verifyUserNameIsCorrectlyDisplayedInHeader(userName) {
    cy.get('header').within(() => {
        cy.get('a').should('contain', 'MERN SHOP'); // Ensures the store name exists
        cy.get('.MuiStack-root').should('contain', `Hey👋, ${userName}`); // Checks if the username is displayed correctly
    });
}

function ensureAuthInputsAreVisible(){
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
}
function verifyAdminButtonInHeader(){
    cy.get('header').within(() => {
        cy.get('a').should('contain', 'MERN SHOP'); // Ensures the store name exists
        cy.get('.MuiStack-root').find('button').should('contain', 'Admin') // Checks if the username is displayed correctly
    });

}