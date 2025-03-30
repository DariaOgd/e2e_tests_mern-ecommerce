import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands";

describe('When veryfying user wishlist', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        const userEmail = 'Pawel@gmail.com'
        const userPassword = 'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
      })

      let headerText; 
      it('Should add product to wishlist from product detail page', () => {
        openFirstProductDetails();
      
        cy.get('.MuiStack-root h4').first()
          .invoke('text')
          .then((text) => {
            const headerText = text.trim();
            cy.log(headerText);
            addToWishlist()
            openWishlist();
            verifyProductInWishlist(headerText, 0)
      
            //remove from cart
            removeProductFromWishlist()
      
            cy.get(".MuiStack-root").should('not.have.class', '.MuiGrid-container')
      
        }); // <- tu zamykasz `.then()`, ale gdzie zamknięcie `it()`?
      
        // BRAKUJE tego nawiasu zamykającego `it()`
      })

      it('should add a note to a product in a wishlist', () => {
        const note = "Notatka"
        openFirstProductDetails();
        addToWishlist()
        openWishlist();
        addNoteToProductInWishlist(note, 0)
        verifyNoteInWishlist(note, 0)
        removeProductFromWishlist()
      })

      it('should add product from wishlist to cart', () => {
        openFirstProductDetails();
        addToWishlist()
        openWishlist();
        operateOnWishlistProductByIndex(0, function(){
          cy.intercept('POST', '**/cart').as('addToCart');
          cy.get('.MuiButtonBase-root').contains('Add To Cart').click()
          cy.wait('@addToCart').its('response.statusCode').should('eq', 201);
        })
        CartCommands.openCartFromHeader()
        cy.get(".MuiStack-root").should('have.class', 'MuiPaper-root')
        CartCommands.removeProductFromCart()
        openWishlist()
        removeProductFromWishlist()

      })
    })

function openFirstProductDetails() {
    cy.get('.MuiGrid-container .MuiPaper-root').first().click()
  }
function openWishlist(){
  cy.visit('http://localhost:3000/wishlist')
}

function addToWishlist(){
  cy.get(".PrivateSwitchBase-input").click();


}

function removeProductFromWishlist(){
  cy.get(".MuiGrid-container .MuiPaper-root").first().within(() => {
    cy.get(".PrivateSwitchBase-input").click();
  })
}

function addNoteToProductInWishlist(note, index = 0) {
  cy.get(".MuiGrid-container .MuiPaper-root").eq(index).within(() => {
    cy.get('[data-testid="EditOutlinedIcon"]').click();
  });
  cy.get('textarea').first().clear().type(note);
  cy.get('.MuiButtonBase-root').contains("Update").click();
}

function verifyNoteInWishlist(note, index = 0) {
  cy.get('.MuiGrid-container .MuiPaper-root')
    .eq(index)
    .within(() => {
      cy.get('.MuiBox-root p').should('contain', note);
    });
}

function verifyProductInWishlist(headerText, index = 0) {
  cy.get(".MuiGrid-container .MuiPaper-root")
    .eq(index)
    .should('contain.text', headerText);
}

function operateOnWishlistProductByIndex(index = 0, callback) {
  cy.get('.MuiGrid-container .MuiPaper-root')
    .eq(index)
    .within(() => {
      callback();
    });
}
