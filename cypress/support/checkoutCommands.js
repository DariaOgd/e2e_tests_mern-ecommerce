class CheckoutCommands {
    static fillAddressForm({ type, street, country, phone, city, state, postalCode }) {
        cy.get('.MuiStack-root form').first().within(() => {
          cy.contains("Type").parent().find(".MuiInputBase-root").type(type)
          cy.contains("Street").parent().find(".MuiInputBase-root").type(street)
          cy.contains("Country").parent().find(".MuiInputBase-root").type(country)
          cy.contains("Phone Number").parent().find(".MuiInputBase-root").type(phone)
          cy.contains("City").parent().find(".MuiInputBase-root").type(city)
          cy.contains("State").parent().find(".MuiInputBase-root").type(state)
          cy.contains("Postal Code").parent().find(".MuiInputBase-root").type(postalCode)
        })
      }
    static selectPaymentMethod(method = "Card") {
        cy.get(".MuiStack-root").contains("Payment Methods").parent().parent().within(() => {
          cy.contains(method).parent().find("input").click()
        })
      }
      
    static placeOrder() {
        cy.intercept('POST', '/orders').as('createOrder')
        cy.get(".MuiStack-root").contains("Pay and order").click()
        cy.wait('@createOrder')
      }
    static navigateToCheckout(){
        cy.get(".MuiStack-root .MuiButtonBase-root").contains('Checkout').click()
    
    }
    static submitAddressForm(){
        cy.get(".MuiStack-root").contains("Add").click()
    
    }
    static verifyConfirmationText(){
      cy.get('.MuiPaper-root')
      .invoke('text')
      .should('match', /Your Order #[a-f0-9]+ is confirmed/)
  }
  static verifyMostRecentOrder( orderId, total, productName) {
    cy.get(".MuiStack-root .MuiPaper-root").first().within(() => {
      cy.contains('Order Number').parent().should('contain', orderId)
      cy.contains('Total Amount').parent().should('contain', total)
      cy.contains(productName)
    });
  }
  



static assertCheckoutTotalMatchesCartSubtotalWithFees(subtotal, fixedFees = 10.55) {
  const expectedTotal = subtotal + fixedFees;

  cy.get('.MuiStack-root').contains('Total').parent().within(() => {
    cy.get('.MuiTypography-root').last().invoke('text').then((totalText) => {
      const numericTotal = parseFloat(totalText.replace(/[^0-9.]/g, ''));
      expect(numericTotal).to.eq(expectedTotal);
    });
  });
}
static removeItemsFromCheckout(){
  cy.get(".MuiStack-root").contains("Order summary").parent().contains("Remove").click()


}
static assertCheckoutTotalFormat() {
  cy.get('.MuiStack-root').contains('Total').parent().within(() => {
    cy.get('.MuiTypography-root').last()
      .invoke('text')
      .as('checkoutTotal');
  });

  cy.get('@checkoutTotal').then((totalText) => {
    expect(totalText).to.match(/^\$\d+(\.\d{2})?$/);
  });
}


    

}

export default CheckoutCommands;
