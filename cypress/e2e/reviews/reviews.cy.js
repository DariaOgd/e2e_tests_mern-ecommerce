import CommonHelper from "../../support/commonHelper"
import ProductDetailsCommands from "../../support/productDetailsCommands"
describe('When veryfing user revierws', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login')

        CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
      })



    it('user should have possibility to add a review, edit it and delete it', () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        const comment = `Komentarz nr. ${randomNumber}`;
        openFirstProductDetails()

        ProductDetailsCommands.writeAReview(comment)
        selectStar(3)
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

function openFirstProductDetails() {
    cy.get('.MuiGrid-container .MuiPaper-root').first().click()
  }

  function selectStar(rating) {
    cy.get('.MuiRating-root').last().within(() => {
      cy.get(`input[value="${rating}"]`).click({ force: true });
    });
  }
  



function verfyIfREviewIsCorrect(text){
    cy.get('.MuiStack-root').contains(text).parent().parent().within(() => {
        cy.get('motiondiv ')
    })
}


function verfyIfREviewDoesNotExit(commentText){
    cy.get('.MuiStack-root').should('not.contain',commentText)

}

function assertReviewNotAdded(){
  cy.intercept('POST', '**/reviews').as('postReview');
  
cy.get(".MuiButtonBase-root").contains("Add review").click()

cy.wait('@postReview').then((interception) => {
    // Check status code
    expect(interception.response.statusCode).to.be.oneOf([500, 400, 422]);
})

}



