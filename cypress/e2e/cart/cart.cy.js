import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands"
import ApiHelper from "../../support/apiHelper"

describe('Cart functionality tests', () => {
  beforeEach(() => {
    cy.visit('/login')

    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
  })

  after(() => {
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))
  })

  it('adds products to cart and retains them after reload', function () {
    CommonHelper.operateOnProductByIndex(0, () => {
      CommonHelper.addProductToCartFromMainPage();
      CommonHelper.captureNameAndPrice.call(this, 'name1', 'price1');
    });
  
    CommonHelper.operateOnProductByIndex(1, () => {
      CommonHelper.addProductToCartFromMainPage();
      CommonHelper.captureNameAndPrice.call(this, 'name2', 'price2');
    });
  
    cy.then(function () {
      const prices = [this.price1, this.price2];
      const subtotal = CartCommands.calculateSubtotal(prices);
      this.savedSubtotal = subtotal;
    });
  
    cy.reload().then(() => {
        cy.visit('/cart');
        cy.wait(2000)
        CartCommands.assertProductPricesInCart([this.price1, this.price2]);
        
    }
    );
  });
  
})

