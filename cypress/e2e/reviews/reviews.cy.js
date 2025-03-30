import CommonHelper from "../../support/commonHelper"
import ProductDetailsCommands from "../../support/productDetailsCommands"
describe('When veryfing user revierws', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        const userEmail = 'Pawel@gmail.com'
        const userPassword = 'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
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

    it.only('user should have possibility to add a review, edit it and delete it', () => {
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