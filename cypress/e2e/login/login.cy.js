import CommonHelper from "../../support/commonHelper"
describe('Login functionality tests', () => {
    let userEmail = Cypress.env("userEmail")
    let userPassword = Cypress.env("userPassword")
    beforeEach(() => {
        cy.visit('/login')
    })
    it('logs in successfully with valid credentials', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        const user_name = 'Pael'
        CommonHelper.verifyToastModal('login successful')
        verifyUserNameIsCorrectlyDisplayedInHeader(user_name)

    })

    it('logs out user successfully', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.Logout()
        ensureAuthInputsAreVisible()

    })

    it.skip('blocks login attempt with wrong password', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it('blocks login attempt with wrong email', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it('allows admin user to log in successfully', () => {
        CommonHelper.LogIn(Cypress.env("adminEmail"), Cypress.env("adminPassword"))
        CommonHelper.verifyToastModal('login successful')
        verifyAdminButtonInHeader()
    })

    it('keeps user logged in after page refresh', () => {
        CommonHelper.LogIn(userEmail, userPassword)
        cy.reload()
        verifyUserNameIsCorrectlyDisplayedInHeader('Pawel')
    })
})


function verifyUserNameIsCorrectlyDisplayedInHeader(userName) {
    cy.get('header').within(() => {
        cy.get('a').should('contain', 'MERN SHOP');
        cy.get('.MuiStack-root').should('contain', `Hey👋, ${userName}`);
    });
}

function ensureAuthInputsAreVisible(){
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
}
function verifyAdminButtonInHeader(){
    cy.get('header').within(() => {
        cy.get('a').should('contain', 'MERN SHOP'); 
        cy.get('.MuiStack-root').find('button').should('contain', 'Admin') 
    });

}