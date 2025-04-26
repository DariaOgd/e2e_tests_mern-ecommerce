import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands"
import CheckoutCommands from "../../support/checkoutCommands"
import ApiHelper from "../../support/apiHelper"
describe('Checkout flow tests', () => {

  beforeEach(() => {
    cy.visit('/login')

    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

  })
  afterEach(() => {
  })

  it('should complete checkout successfully with card payment', () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart();
    CartCommands.openCartFromHeader();
    CheckoutCommands.navigateToCheckout();
  
    CheckoutCommands.fillAddressForm({
      type: "Home",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    });
  
    CheckoutCommands.submitAddressForm();
    CheckoutCommands.selectPaymentMethod();
    CheckoutCommands.assertCheckoutTotalFormat()

  
    CheckoutCommands.placeOrder();
    CheckoutCommands.verifyConfirmationText();
  });

  
  it.skip('should prevent checkout when address form is incomplete', () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    CheckoutCommands.selectPaymentMethod()
    submitOrderExpectingFailure()
  })

  it("should complete checkout successfully with cash payment", () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()

    CheckoutCommands.fillAddressForm({
      type: "Home",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    })

    CheckoutCommands.submitAddressForm()
    CheckoutCommands.selectPaymentMethod("Cash")
    CheckoutCommands.placeOrder()
    CheckoutCommands.verifyConfirmationText()

  })

  it("should complete checkout successfully with card payment", () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()

    CheckoutCommands.fillAddressForm({
      type: "Home",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    })
    CheckoutCommands.submitAddressForm()
    CheckoutCommands.selectPaymentMethod("Cash")
    CheckoutCommands.placeOrder()
    CheckoutCommands.verifyConfirmationText()
  })

  it('should not allow checkout if no payment method is selected', () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()

    CheckoutCommands.fillAddressForm({
      type: "Home",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    })
    CheckoutCommands.submitAddressForm()

    CheckoutCommands.placeOrder()
    submitOrderExpectingFailure()

    CheckoutCommands.removeItemsFromCheckout()
  })


  it('form should validate if address is incorrect', () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    cy.get(".MuiStack-root").contains("Reset").click()
    CheckoutCommands.fillAddressForm({
      type: "1",
      street: "1",
      country: "1",
      phone: "aaaa",
      city: "1",
      state: "1",
      postalCode: "abc"
    })
    CheckoutCommands.submitAddressForm()
    CheckoutCommands.selectPaymentMethod("Cash")

    CheckoutCommands.placeOrder()
    submitOrderExpectingFailure()

  })

  it('form should validate if address is empty', () => {
    CommonHelper.openFirstProductDetails()
    CartCommands.addToCart()
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    resetAdress()
    clickOnAddAdress()


    CheckoutCommands.submitAddressForm()
    CheckoutCommands.selectPaymentMethod("Cash")

    CheckoutCommands.placeOrder()
    submitOrderExpectingFailure()

  })
})

// Helper functions

describe("Verying cart to checkout flow", () => {
  beforeEach(() => {
    cy.visit('/login')

    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

  })

  it("should correctly calculate total in checkout based on cart subtotal and additional fees", () => {
    CommonHelper.operateOnProductByIndex(0, () => {
      CommonHelper.addProductToCartFromMainPage();
      CommonHelper.captureNameAndPrice('name1', 'price1');
    });

    CommonHelper.operateOnProductByIndex(1, () => {
      CommonHelper.addProductToCartFromMainPage();
      CommonHelper.captureNameAndPrice('name2', 'price2');
    });
    CartCommands.openCartFromHeader()

    cy.then(function () {
      const prices = [this.price1, this.price2];
      const subtotal = CartCommands.calculateSubtotal(prices);
      cy.wrap(subtotal).as('subtotal');
      CheckoutCommands.navigateToCheckout()

      cy.get('@subtotal').then((subtotal) => {
        CheckoutCommands.assertCheckoutTotalMatchesCartSubtotalWithFees(subtotal);
      });


    });
  })

})

function submitOrderExpectingFailure(){
  cy.intercept('POST', '/orders').as('createOrder')
  cy.get(".MuiStack-root").contains("Pay and order").click()
  cy.wait('@createOrder').its('response.statusCode').should('not.be.oneOf', [200, 201])
}
function resetAdress(){
  cy.get(".MuiStack-root").contains("Reset").click()
}
function clickOnAddAdress(){
  cy.get(".MuiStack-root").contains("Add").click()


}
