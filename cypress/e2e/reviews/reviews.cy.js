import CommonHelper from "../../support/commonHelper"
import ProductDetailsCommands from "../../support/productDetailsCommands"
describe('When veryfing user revierws', () => {

    beforeEach(() => {
        cy.visit('/login')

        CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
      })



    it('user should have possibility to add a review, edit it and delete it', () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        const comment = `Komentarz nr. ${randomNumber}`;
        CommonHelper.openFirstProductDetails()

        ProductDetailsCommands.writeAReview(comment)
        ProductDetailsCommands.selectStar(3)
        ProductDetailsCommands.clickOnAddReviewButton()
        verfyReviewIsCorrect(comment)

        //edit
        ProductDetailsCommands.editComment(comment, comment + "Edit")

        verfyReviewIsCorrect(comment + "Edit")

        //delete
        ProductDetailsCommands.deleteComment(comment + "Edit")
        verfyReviewDoesNotExit(comment + "Edit")
    })

})





function verfyReviewIsCorrect(text){
    cy.get('.MuiStack-root').contains(text).parent().parent().within(() => {
        cy.get('motiondiv ')
    })
}


function verfyReviewDoesNotExit(commentText){
    cy.get('.MuiStack-root').should('not.contain',commentText)

}




