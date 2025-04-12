import CommonHelper from "../../support/commonHelper"

describe('When veryfing user profile', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        const userEmail = 'Pawel@gmail.com'
        const userPassword = 'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
      })
    it('should verify if user can achive profile section from header', () => {
        const name = 'Paerl'
        const email = 'Pawel@gmail.com'
        cy.get('header').within(() => {
            cy.get('.MuiAvatar-root').click() // Ensures the store name exists
        });

        cy.get('ul[role="menu"]').contains("Profile").click()
        cy.url().should('include', '/profile');

        cy.get(".MuiStack-root .MuiPaper-root").within(() =>{
            cy.get('.MuiStack-root').should('contain', name)
            cy.get('.MuiStack-root').should('contain', email)
        })
    })

    it('should verify if user can change data profile', () => {

    })

})