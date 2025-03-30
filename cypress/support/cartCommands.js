class CartCommands {
    static addToCart() {
        cy.get('.MuiStack-root')
          .contains('Add To Cart')
          .click()
          cy.wait(2000)
      }
    static openCartFromHeader(){
        cy.get('header').within(() => {
          cy.get('[data-testid="ShoppingCartOutlinedIcon"]').click({force : true});
        })
      }
    static removeProductFromCart(){
        cy.intercept('DELETE', /\/cart\/.*/).as('cartRequest')
        cy.get('.MuiStack-root').contains("Remove").first().click()
        cy.wait('@cartRequest').then((interception) => {
          const requestUrl = interception.request.url
          cy.log('Request URL:', requestUrl)
          const productId = requestUrl.split('/').pop()
          cy.log('Captured Product ID:', productId)
          expect(productId).to.match(/^[a-z0-9]+$/)
        })
  }

  static assertCartIconShowsQuantity(quantity){
    cy.get('header').within(() => {
      cy.get('a').should('contain', 'MERN SHOP')
      cy.get('[data-testid="ShoppingCartOutlinedIcon"]')
        .parent()
        .parent()
        .find('span')
        .should('contain.text', quantity)
    })
  
  
  }

    

}

export default CartCommands;
