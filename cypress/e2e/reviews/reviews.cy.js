import CommonHelper from "../../support/commonHelper"
import ProductDetailsCommands from "../../support/productDetailsCommands"
describe('Product reviews functionality tests', () => {

    beforeEach(() => {
        cy.visit('/login')

        CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
      })



    it('adds, edits and deletes a product review', () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        const comment = `Komentarz nr. ${randomNumber}`;
        CommonHelper.openFirstProductDetails()

        ProductDetailsCommands.writeAReview(comment)
        ProductDetailsCommands.selectStar(3)
        ProductDetailsCommands.clickOnAddReviewButton()
        verifyReviewIsCorrect(comment)

        ProductDetailsCommands.editComment(comment, comment + "Edit")
        verifyReviewIsCorrect(comment + "Edit")

        ProductDetailsCommands.deleteComment(comment + "Edit")
        verifyReviewDoesNotExit(comment + "Edit")
    })

})





function verifyReviewIsCorrect(text){
    cy.get('.MuiStack-root').contains(text).parent().parent().within(() => {
        cy.get('motiondiv ')
    })
}


function verifyReviewDoesNotExit(commentText){
    cy.get('.MuiStack-root').should('not.contain',commentText)

}




