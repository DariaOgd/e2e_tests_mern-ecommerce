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

  static extractNumber(priceStr) {
    return parseFloat(priceStr.replace(',', '.').replace(/[^\d.]/g, ''));
  }

  static calculateSubtotal(prices) {
    return prices.reduce((sum, priceStr) => {
      const num = this.extractNumber(priceStr);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }

  static assertProductPricesInCart(expectedPrices) {
    cy.get('.MuiStack-root p').then(($p) => {
      const prices = [...$p].map(p => p.innerText);
      expectedPrices.forEach((expectedPrice) => {
        expect(
          prices.some(price => price.includes(expectedPrice)),
          `Expected product price "${expectedPrice}" to be in the cart`
        ).to.be.true;
      });
    });
  }
  static formatSubtotal(subtotal) {
    return parseFloat(subtotal).toFixed(2); // "1200.00"
  }
  

  static assertSubtotalInCart(expectedSubtotal) {
    cy.get('h6').then(($h6) => {
      const subtotalInCart = [...$h6]
        .map(el => el.innerText)
        .map(text => parseFloat(text.replace(/[^0-9.]/g, ''))) // usuwa $, spacje, itd.
        .filter(num => !isNaN(num)); // tylko liczby
  
      const expected = parseFloat(expectedSubtotal);
  
      const found = subtotalInCart.some(num => num === expected);
  
      expect(
        found,
        `Expected subtotal "${expected}" to be visible in the cart`
      ).to.be.true;
    });
  }
  

  static assertProductNamesInCart(expectedNames) {
    cy.get('.MuiStack-root a').then(($links) => {
      const names = [...$links].map(link => link.innerText);
      expectedNames.forEach((expectedName) => {
        expect(
          names.some(name => name.includes(expectedName)),
          `Expected product name "${expectedName}" to be in the cart`
        ).to.be.true;
      });
    });
  }


    

}

export default CartCommands;
