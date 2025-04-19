class FormHelper{
    static clickFormButton(label) {
        cy.get("form").contains(label).click();
      }

    static deleteAddressByLabel(label) {
        cy.intercept('DELETE', '**/address/*').as('deleteAddress');
        cy.get('.MuiStack-root').contains(label.toUpperCase()).parent().parent().within(() => {
          this.clickFormButton("Remove");
        });
        cy.wait('@deleteAddress');
      }

      static updateFormFieldAndSubmit(fieldLabel, newText) {
        cy.get('form').first().within(() => {
          cy.contains(fieldLabel).parent().find('input').clear().type(newText);
          cy.contains("Save Changes").click();
        });
      
        cy.get('form').first().should('contain', newText);
      
      }

}

export default FormHelper