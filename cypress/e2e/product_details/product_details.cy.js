import CommonHelper from "../../support/commonHelper"
import _ from 'lodash';
import CartCommands from "../../support/cartCommands";
import ProductDetailsCommands from "../../support/productDetailsCommands";
import ApiHelper from "../../support/apiHelper";

describe('Product details functionality tests', () => {

  beforeEach(() => {
    cy.visit('/login')

    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))

  })
  after(() => {
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

  })

  it('opens product details from main page', () => {
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))
    CommonHelper.openFirstProductDetails()
    assertItemHasSomeTitle()
    assertStockStatusIsDisplayedCorrectly()
    verifyAddToCartButtonExist()
  })

  it('adds product with specific quantity to cart', () => {
    CommonHelper.openFirstProductDetails()
    ProductDetailsCommands.setProductQuantity(3, 1)
    assertProductQuantityDisplayed(3)
    CartCommands.addToCart()
    CartCommands.assertCartIconShowsQuantity('1')
    CartCommands.openCartFromHeader()
  })

})


function assertProductQuantityDisplayed(quantity){
  cy.get('.MuiStack-root')
  .contains(/Add To Cart|In Cart/)
  .parent()
  .should('contain.text', quantity)

}

function verifyAddToCartButtonExist(){
  cy.get('.MuiStack-root')
  .should('contain.text', 'Add To Cart')

}
function assertItemHasSomeTitle(){
  cy.get('.MuiStack-root h4')
  .invoke('text')
  .should('not.be.empty')


}
function assertStockStatusIsDisplayedCorrectly(){
  cy.get('.MuiStack-root .MuiRating-root')
  .parent()
  .find('p')
  .last()
  .invoke('text')
  .then((text) => {
    const trimmedText = text.trim();
    expect(['In Stock', 'Out of Stock']).to.include(trimmedText);
  })

}
