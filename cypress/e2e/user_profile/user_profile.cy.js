import CommonHelper from "../../support/commonHelper";
import CheckoutCommands from "../../support/checkoutCommands";

describe('When verifying user profile functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    const userEmail = 'Pawel@gmail.com';
    const userPassword = 'Password123!';
    CommonHelper.LogIn(userEmail, userPassword);
    selectHeaderMenuOption('Profile');
    cy.url().should('include', '/profile');
  });

  it('should verify if user can access profile section from header', () => {
    assertUserProfileContains({ name: 'Pael', email: 'Pawel@gmail.com' });
  });

  it('should verify if user can add new profile data (address)', () => {
    cy.get('.MuiPaper-root button').contains("Add").click();

    CheckoutCommands.fillAddressForm({
      type: "Home - test adress",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    });

    clickFormButton("add");
  });

  it('should verify address data is displayed correctly', () => {
    assertAddressInForm({
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1",
    });
  });

  it('should update the address data', () => {
    cy.get('.MuiStack-root').contains('HOME').parent().parent().within(() => {
      clickFormButton("Edit");
    });

    updateFormFieldAndSubmit("Street", "Updated street");
    cy.get('form').first().should('contain', "Updated street");
  });

  it('should delete the address successfully', () => {
    deleteAddressByLabel("Home - test adress");
    verifyAdressNotExistByLabel('Home - test adress')

  });
});


// 🔧 Helper Functions

function selectHeaderMenuOption(option) {
  cy.get('header').within(() => {
    cy.get('.MuiAvatar-root').click();
  });
  cy.get('ul[role="menu"]').contains(option).click();
}

function clickFormButton(label) {
  cy.get("form").contains(label).click();
}

function updateFormFieldAndSubmit(fieldLabel, newText) {
  cy.get('form').first().within(() => {
    cy.contains(fieldLabel).parent().find('input').clear().type(newText);
    cy.contains("Save Changes").click();
  });
}

function assertUserProfileContains({ name, email }) {
  cy.get(".MuiStack-root .MuiPaper-root").within(() => {
    cy.get('.MuiStack-root').should('contain', name);
    cy.get('.MuiStack-root').should('contain', email);
  });
}

function assertAddressInForm(expectedValues) {
  cy.get('form').first().within(() => {
    Object.values(expectedValues).forEach(value => {
      cy.contains(value);
    });
  });
}

function deleteAddressByLabel(label) {
  cy.intercept('DELETE', '**/address/*').as('deleteAddress');
  cy.get('.MuiStack-root').contains(label.toUpperCase()).parent().parent().within(() => {
    clickFormButton("Remove");
  });
  cy.wait('@deleteAddress');
}

function verifyAdressNotExistByLabel(label){
  cy.get('.MuiStack-root').should('not.contain.text', label);
}