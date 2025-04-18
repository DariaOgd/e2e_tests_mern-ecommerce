import CommonHelper from "../../support/commonHelper"
import CartCommands from "../../support/cartCommands";
import ApiHelper from "../../support/apiHelper";

describe('When veryfying user wishlist', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')

        CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
      })
      after(() => {
        ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

    
      })

      let headerText; 
      it('Should add product to wishlist from product detail page', () => {
        openFirstProductDetails();

        getProductTitleFromDetailsPage().then((title) => {
          cy.log(title);
          addProductToWishlistAndVerify(title);
          removeProductFromWishlistAndVerifyEmpty();
        });
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



function getProductTitleFromDetailsPage() {
  return cy.get('.MuiStack-root h4').first().invoke('text').then((text) => text.trim());
}

function addProductToWishlistAndVerify(title, index = 0) {
  addToWishlist();
  openWishlist();
  verifyProductInWishlist(title, index);
}

function removeProductFromWishlistAndVerifyEmpty() {
  removeProductFromWishlist();
  cy.get(".MuiStack-root").should('not.have.class', '.MuiGrid-container');
}
