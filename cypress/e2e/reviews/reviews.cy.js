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
        verfyIfREviewIsCorrect(comment)

        //edit
        ProductDetailsCommands.editComment(comment, comment + "Edit")

        verfyIfREviewIsCorrect(comment + "Edit")

        //delete
        ProductDetailsCommands.deleteComment(comment + "Edit")
        verfyIfREviewDoesNotExit(comment + "Edit")
    })

})





function verfyIfREviewIsCorrect(text){
    cy.get('.MuiStack-root').contains(text).parent().parent().within(() => {
        cy.get('motiondiv ')
    })
}


function verfyIfREviewDoesNotExit(commentText){
    cy.get('.MuiStack-root').should('not.contain',commentText)

}




