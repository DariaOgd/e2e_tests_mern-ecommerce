import CommonHelper from "../../support/commonHelper"
describe('Given login page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })
    it('should verify if user can log in', () => {
        const userEmail = 'Pawel@gmail.com'
        const userPassword =  'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
        const user_name = 'Paerl'
        CommonHelper.verifyToastModal('login successful')
        verifyUserNameIsCorrectlyDisplayedInHeader(user_name)

    })

    it('should logout user', () => {
        const userEmail = 'Pawel@gmail.com'
        const userPassword =  'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.Logout()
        ensureAuthInputsAreVisible()

    })

    it.skip('should verify that user cant log in with wrong password', () => {
        const userEmail = 'Pawel@gmail.com'
        const userPassword =  'Password123!__wrong'
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it('should verify that user cant log in with wrong email', () => {
        const userEmail = 'Pawel1@gmail.com'
        const userPassword =  'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('invalid credentials')
        ensureAuthInputsAreVisible()

    })

    it.only('should verify that user admin user can log in', () => {
        const userEmail = 'Admin1@gmail.com'
        const userPassword =  'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
        CommonHelper.verifyToastModal('login successful')
        verifyAdminButtonInHeader()
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