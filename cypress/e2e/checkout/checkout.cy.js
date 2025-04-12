import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands"
import CheckoutCommands from "../../support/checkoutCommands"

describe('When verifying checkout', () => {
  let orderId, total, productName

  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    const userEmail = 'Pawel@gmail.com'
    const userPassword = 'Password123!'
    CommonHelper.LogIn(userEmail, userPassword)
  })

  it('should complete checkout successfully with card payment', () => {
    openFirstProductDetails()
    CartCommands.addToCart()
    cy.wait(1000)
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    cy.wait(2000)
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
    CheckoutCommands.selectPaymentMethod()
    cy.get('.MuiStack-root').contains('Total').parent().within(() => {
      cy.get('.MuiTypography-root').last()
        .invoke('text')
        .then((totalText) => {
          total = totalText
        })
    })
    cy.get(".MuiStack-root").contains("Order summary").parent().within(() => {
      cy.get(".MuiPaper-root").contains("Quantity").parent().find('a')
        .invoke('text')
        .then((linkText) => {
          productName = linkText
        })
    })
    CheckoutCommands.placeOrder()
    verifyConfirmationText()
  })

  it('should display correct order details after placing an order', () => {
    cy.visit('http://localhost:3000/orders')



    cy.then(() => {
      verifyOrderItem(0, orderId, total, productName)
    })
  })
  
  it.skip('should prevent checkout when address form is incomplete', () => {
    openFirstProductDetails()
    CartCommands.addToCart()
    cy.wait(1000)
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    cy.wait(2000)
    CheckoutCommands.selectPaymentMethod()
    submitOrderExpectingFailure()
  })

  it("should complete checkout successfully with cash payment", () => {
    openFirstProductDetails()
    CartCommands.addToCart()
    cy.wait(1000)
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    cy.wait(2000)

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
    verifyConfirmationText()

  })

  it('should not allow checkout if no payment method is selected', () => {
    openFirstProductDetails()
    CartCommands.addToCart()
    cy.wait(1000)
    CartCommands.openCartFromHeader()
    CheckoutCommands.navigateToCheckout()
    cy.wait(2000)

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

    //after
    cy.get(".MuiStack-root").contains("Order summary").parent().contains("Remove").click()
  })

  //wrong address and no adress
})

function submitOrderExpectingFailure(){
    cy.intercept('POST', '/orders').as('createOrder')
    cy.get(".MuiStack-root").contains("Pay and order").click()
    cy.wait('@createOrder').its('response.statusCode').should('not.be.oneOf', [200, 201])
}
// Helper functions

function openFirstProductDetails() {
  cy.get('.MuiGrid-container .MuiPaper-root').first().click()
}

function verifyOrderItem(index, orderId, total, productName) {
    cy.get(".MuiPaper-root").first(() => {
        cy.contains('Order Number').parent().should('contain', orderId)
        cy.contains('Total Amount').parent().should('contain', total)
        cy.contains(productName)
    })
}

function verifyConfirmationText(){
    cy.get('.MuiPaper-root')
    .invoke('text')
    .should('match', /Your Order #[a-f0-9]+ is confirmed/)
}

