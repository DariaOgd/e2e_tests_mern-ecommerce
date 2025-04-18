import CommonHelper from "../../support/commonHelper"
import ProductDetailsCommands from "../../support/productDetailsCommands"
describe('When veryfing user revierws', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        const userEmail = 'Pawel@gmail.com'
        const userPassword = 'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
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
    it('should check if product detail contains reviews sectrion', () => {
      openFirstProductDetails()

      cy.get('.MuiStack-root').contains("Reviews").parent().within(() => {
          cy.get('h4').should('contain', "Reviews")
          cy.get('.MuiStack-root .MuiRating-root')
          .invoke('attr', 'aria-label')
          .should('match', /^\d+\sStars$/)
      })
  })

    it('shouldnot allow user to add empty revire', () => {
      const randomNumber = Math.floor(Math.random() * 10000);
      openFirstProductDetails()

      ProductDetailsCommands.writeAReview(" ")
      selectStar(3)
      assertReviewNotAdded()
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



