import CommonHelper from "../../support/commonHelper"
import _ from 'lodash';
import CartCommands from "../../support/cartCommands";
import ProductDetailsCommands from "../../support/productDetailsCommands";

describe('When verifying product details', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    const userEmail = 'Pawel@gmail.com'
    const userPassword = 'Password123!'
    CommonHelper.LogIn(userEmail, userPassword)
  })

  it('should verify if user can access product detail from main page', () => {

    openFirstProductDetails()

    cy.wait(1000) // If you can, avoid arbitrary waits. Prefer `.should()`.

    // Verify product title exists
    cy.get('.MuiStack-root h4')
      .invoke('text')
      .should('not.be.empty')

    // Verify rating is in expected format (e.g. "4 Stars")
    cy.get('.MuiStack-root .MuiRating-root')
      .invoke('attr', 'aria-label')
      .should('match', /^\d+\sStars$/)

    // Verify "In Stock" or "Out of Stock"
    cy.get('.MuiStack-root .MuiRating-root')
      .parent()
      .find('p')
      .last()
      .invoke('text')
      .then((text) => {
        const trimmedText = text.trim();
        expect(['In Stock', 'Out of Stock']).to.include(trimmedText);
      })

    // Optionally verify "Add To Cart" button exists
    cy.get('.MuiStack-root')
      .should('contain.text', 'Add To Cart')
  })

  it.only('should add product to cart and remove it', () => {

    openFirstProductDetails()
    ProductDetailsCommands.setProductQuantity(3, 1)
    assertProductQuantityDisplayed(3)

    CartCommands.addToCart()

    CartCommands.assertCartIconShowsQuantity('1')

    cy.wait(1000)
    CartCommands.openCartFromHeader()
    CartCommands.removeProductFromCart()


  })


  function openFirstProductDetails() {
    cy.get('.MuiGrid-container .MuiPaper-root').first().click()
  }

})


function assertProductQuantityDisplayed(quantity){
  cy.get('.MuiStack-root')
  .contains(/Add To Cart|In Cart/)
  .parent()
  .should('contain.text', quantity)

}

