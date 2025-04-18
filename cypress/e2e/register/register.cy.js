import CommonHelper from "../../support/commonHelper"
describe('Given register page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signup')
    })
    it('should verify if user can create account with correct provided data', () => {
        let number = generateTwoDigitNumber()
        const userEmail = `user_name_${number}@gmail.com`
        const userName = `user_name_${number}`
        const userPassword =  Cypress.env("userPassword")
        CommonHelper.Register(userName, userEmail, userPassword, true)
        CommonHelper.verifyUserNameIsCorrectlyDisplayedInHeader(userName)
    })

    it('should verify if user cant create an account if already has an account', () => {
        let number = generateTwoDigitNumber()
        const userEmail = 'Pawel@gmail.com'
        const userName = `user_name_${number}`
        const userPassword =  Cypress.env("userPassword")
        CommonHelper.Register(userName, userEmail, userPassword, true)
        verifyRegisterFormFieldsExist()
    })
    it.only('should verify if user cant create an account if something is empty', () => {
        let number = generateTwoDigitNumber()
        const userEmail = 'Pawel@gmail.com'
        const userName = `user_name_${number}`
        const userPassword =  ' '
        CommonHelper.Register(userName, userEmail, userPassword, true)
    })
    
    it('should verify that user cant create an account if it doesnt match password criteria', () => {
        const info_text = 'at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters'
        let number = generateTwoDigitNumber()
        const userEmail = `user_name_${number}@gmail.com`
        const userName = `user_name_${number}`
        const userPassword =  'Password'
        CommonHelper.Register(userName, userEmail, userPassword, true)
        cy.get('input[placeholder="Password"]').parent().parent().parent().should('contain', info_text)
    })

})

function generateTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10;
}

function verifyRegisterFormFieldsExist(){
    cy.get('input[placeholder="Username"]').should('exist')
    cy.get('input[placeholder="Email"]').should('exist')
    cy.get('input[placeholder="Password"]').should('exist')
}