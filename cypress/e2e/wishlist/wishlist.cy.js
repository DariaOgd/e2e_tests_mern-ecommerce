import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands";
import ApiHelper from "../../support/apiHelper";
import WishlistHelper from "../../support/wishlistHelper";
describe('When veryfying user wishlist', () => {
    beforeEach(() => {
  
      cy.visit('/login')
        CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))

      })
      after(() => {
        ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

    
      })

      let headerText; 
      it('Should add product to wishlist from product detail page', () => {
        ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

        CommonHelper.openFirstProductDetails();

        getProductTitleFromDetailsPage().then((title) => {
          WishlistHelper.addProductToWishlistAndVerify(title);
          WishlistHelper.removeProductFromWishlistAndVerifyEmpty(0);
        });
      })

      it('should add a note to a product in a wishlist', () => {
        const note = "Notatka"
        CommonHelper.openFirstProductDetails();
        WishlistHelper.addToWishlist()
        WishlistHelper.openWishlist();
        WishlistHelper.addNoteToProductInWishlist(note, 0)
        verifyNoteInWishlist(note, 0)
        WishlistHelper.removeProductFromWishlistByIndex(0)
      })

      it('should add product from wishlist to cart', () => {
        CommonHelper.openFirstProductDetails();
        WishlistHelper.addToWishlist()
        WishlistHelper.openWishlist();
        WishlistHelper.operateOnWishlistProductByIndex(0, function(){
          cy.intercept('POST', '**/cart').as('addToCart');
          CartCommands.addToCart()
          cy.wait('@addToCart').its('response.statusCode').should('eq', 201);
        })
        CartCommands.openCartFromHeader()
        CartCommands.removeProductFromCart()
        WishlistHelper.openWishlist();
        WishlistHelper.removeProductFromWishlistByIndex(0)
      })
    })

// -- helper function --

function verifyNoteInWishlist(note, index = 0) {
  cy.get('.MuiGrid-container .MuiPaper-root')
    .eq(index)
    .within(() => {
      cy.get('.MuiBox-root p').should('contain', note);
    });
}

function getProductTitleFromDetailsPage() {
  return cy.get('.MuiStack-root h4').first().invoke('text').then((text) => text.trim());
}


