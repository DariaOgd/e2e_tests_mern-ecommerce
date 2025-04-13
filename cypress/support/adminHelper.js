class AdminHelper{
    static fillProductFormFields(product) {
        cy.get('form').contains('Title').parent().find('input').type(product.title);
      
        cy.get('form')
          .contains('Description')
          .parent()
          .find('textarea')
          .first()
          .type(product.description);
      
        cy.get('form').contains('Price').parent().find('input').type(product.price);
        cy.get('form').contains('Discount Percentage').parent().find('input').type(product.discountPercentage);
        cy.get('form').contains('Stock Quantity').parent().find('input').type(product.stockQuantity);
        cy.get('form').contains('Thumbnail').parent().find('input').type(product.thumbnail);
      
        cy.get('form')
          .contains('Product Images')
          .parent()
          .find('input')
          .each(($input, index) => {
            const imgUrl = product.images[index] || product.images[0];
            cy.wrap($input).type(imgUrl);
          });
      
        cy.get('#mui-component-select-brand').click().then(() => {
          cy.get('ul li').contains(product.brand).click();
        });
      
        cy.get('#mui-component-select-category').click().then(() => {
          cy.get('ul li').contains(product.category).click();
        });
      }

    static updateProductTitleField(newTitle) {
        cy.get('form').contains('Title').parent().find('input').clear().type(newTitle);
        this.clickFormButton('Update');
      }

    static clickFormButton(text) {
        cy.get('form').contains(text).click();
      }
      
    static assertAdminLabelVisible() {
        cy.get('.MuiToolbar-root button').should('contain', 'Admin');
      }
      
}

export default AdminHelper;