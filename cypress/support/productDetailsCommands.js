class ProductDetailsCommands {

    static setProductQuantity(amount, startingNumber) {
        if (amount <= 1) return; // Already at default of 1, no clicks needed
    
        const clickPlusButton = (clicksRemaining, currentNumber) => {
          if (clicksRemaining === 0) {
            cy.log('✅ Done clicking + button')
            return
          }
    
          cy.get('.MuiStack-root')
            .contains(/Add To Cart|In Cart/)
            .parent()
            .contains(currentNumber.toString())
            .then(() => {
              cy.contains('+').click()
              cy.wait(500) // Prefer to replace with `.should()` where possible
              clickPlusButton(clicksRemaining - 1, currentNumber + 1)
            })
        }
    
        clickPlusButton(amount - 1, startingNumber)
      }
    
      static writeAReview(reviewText){
        cy.get('.MuiButtonBase-root').contains("Write a review").click().then(() => {
            cy.get('.MuiInputBase-root #reviewTextFeild').should('be.visible').type(reviewText)
        })
    
    }

    static clickOnAddReviewButton(){
      cy.intercept('POST', '**/reviews').as('postReview');
  
      cy.get(".MuiButtonBase-root").contains("Add review").click()
  
      cy.wait('@postReview').then((interception) => {
          // Check status code
          expect(interception.response.statusCode).to.eq(201);
      })
  }

  static editComment(comment, commentText){
    cy.get(".MuiPaper-root").contains(comment).parent().parent().within(() => {
        cy.get('button').click()
    }).then(() => {
        cy.get('[role="menu"]').contains('Edit').click()
        cy.get('.MuiFormControl-root [name="comment"]').should('be.visible')
        cy.get('.MuiFormControl-root [name="comment"]').clear().type(commentText)
        cy.get('.MuiStack-root').contains('Update').click()
    })
}

static deleteComment(commentText){
    cy.get(".MuiPaper-root").contains(commentText).parent().parent().within(() => {
        cy.get('button').click()
    }).then(() => {
        cy.get('[role="menu"]').contains('Delete').click()
    })
}



    

}

export default ProductDetailsCommands;
