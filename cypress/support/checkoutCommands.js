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

    

}

export default CheckoutCommands;
