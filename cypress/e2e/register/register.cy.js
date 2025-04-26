import CommonHelper from "../../support/commonHelper"
describe('User registration functionality tests', () => {
    beforeEach(() => {
        cy.visit('/signup')
    })
    it('creates account with correct data', () => {
        let number = generateTwoDigitNumber()
        const userEmail = `user_name_${number}@gmail.com`
        const userName = `user_name_${number}`
        const userPassword =  Cypress.env("userPassword")
        CommonHelper.Register(userName, userEmail, userPassword, true)
        CommonHelper.verifyUserNameIsCorrectlyDisplayedInHeader(userName)
    })

    it('prevents account creation with existing email', () => {
        let number = generateTwoDigitNumber()
        const userEmail = 'Pawel@gmail.com'
        const userName = `user_name_${number}`
        const userPassword =  Cypress.env("userPassword")
        CommonHelper.Register(userName, userEmail, userPassword, true)
        verifyRegisterFormFieldsExist()
    })
    it('prevents account creation with empty fields', () => {
        let number = generateTwoDigitNumber()
        const userEmail = 'Pawel@gmail.com'
        const userName = `user_name_${number}`
        const userPassword =  ' '
        CommonHelper.Register(userName, userEmail, userPassword, true)
    })
    
    it('displays password criteria for weak password', () => {
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