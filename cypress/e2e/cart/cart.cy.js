import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands"
import ApiHelper from "../../support/apiHelper"

describe('When verifying cart', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    const userEmail = 'Pawel@gmail.com'
    const userPassword = 'Password123!'
    CommonHelper.LogIn(userEmail, userPassword)
  })

  after(() => {
    ApiHelper.deleteAllItemsFromCart("67fbbeedef538802e1d50f10")
  })

  it('should add products to cart and persist cart after reload', function () {
    CommonHelper.operateOnProductByIndex(0, () => {
      CommonHelper.addProductToCartFromMainPage();
      captureNameAndPrice.call(this, 'name1', 'price1'); // 👈 bardzo ważne: przekazanie `this`
    });
  
    CommonHelper.operateOnProductByIndex(1, () => {
      CommonHelper.addProductToCartFromMainPage();
      captureNameAndPrice.call(this, 'name2', 'price2');
    });
  
    cy.then(function () {
      const prices = [this.price1, this.price2];
      const subtotal = CartCommands.calculateSubtotal(prices);
      this.savedSubtotal = subtotal;
    });
  
    cy.reload().then(() => {
        cy.visit('http://localhost:3000/cart');
        cy.wait(2000)
        CartCommands.assertProductPricesInCart([this.price1, this.price2]);
        
    }
    );


  

  });
  
})

function captureNameAndPrice(nameAlias, priceAlias) {
  cy.get('h6').first().invoke('text').as(nameAlias)
  cy.get('p').eq(1).invoke('text').as(priceAlias)
}
