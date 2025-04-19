class WishlistHelper{
    static openWishlist(){
        cy.visit('/wishlist')
      }

    static addProductToWishlistAndVerify(title, index = 0) {
        this.addToWishlist();
        this.openWishlist();
        this.verifyProductInWishlist(title, index);
      }

     static  addToWishlist(){
        cy.get(".PrivateSwitchBase-input").click();
      }

      static verifyProductInWishlist(headerText, index = 0) {
        cy.get(".MuiGrid-container .MuiPaper-root")
          .eq(index)
          .should('contain.text', headerText);
      }

      static removeProductFromWishlistAndVerifyEmpty(idx) {
        this.removeProductFromWishlistByIndex(idx);
        cy.get(".MuiStack-root").should('not.have.class', '.MuiGrid-container');
      }

      static removeProductFromWishlistByIndex(index) {
        cy.get(".MuiGrid-container .MuiPaper-root").eq(index).within(() => {
          cy.get(".PrivateSwitchBase-input").click();
        });
      }

      static operateOnWishlistProductByIndex(index = 0, callback) {
        cy.get('.MuiGrid-container .MuiPaper-root')
          .eq(index)
          .within(() => {
            callback();
          });
      }

      static addNoteToProductInWishlist(note, index = 0) {
        cy.get(".MuiGrid-container .MuiPaper-root").eq(index).within(() => {
          cy.get('[data-testid="EditOutlinedIcon"]').click();
        });
        cy.get('textarea').first().clear().type(note);
        cy.get('.MuiButtonBase-root').contains("Update").click();
      }
      
      
    
}
export default WishlistHelper;