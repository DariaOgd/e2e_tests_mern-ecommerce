import CommonHelper from "../../support/commonHelper";
import CheckoutCommands from "../../support/checkoutCommands";
import FormHelper from "../../support/formHelper"
import ApiHelper from "../../support/apiHelper";
import CartCommands from "../../support/cartCommands";
describe('User profile functionality tests', () => {
  beforeEach(() => {
    cy.visit('/login');

    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))
    CommonHelper.selectUserMenuOption('Profile');
    cy.url().should('include', '/profile');
  });

  it('accesses profile section from header', () => {
    assertUserProfileContains({ name: 'Pael', email: 'Pawel@gmail.com' });
  });

  it('adds new address to profile', () => {
    CommonHelper.clickOnButton("Add")

    CheckoutCommands.fillAddressForm({
      type: "Home - test adress",
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    });

    FormHelper.clickFormButton("add");
  });

  it('displays address data correctly in profile', () => {
    assertAddressInForm({
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1",
    });
  });

  it('displays newly added address in checkout flow', () => {
    cy.visit("/")
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))
    CommonHelper.addProductToCartFromMainPage()
    CartCommands.openCartFromHeader();

    CheckoutCommands.navigateToCheckout()
    const expectedAddress = {
      street: "Street 2",
      country: "Poland",
      phone: "111111111",
      city: "gdansk",
      state: "80-000",
      postalCode: "1"
    }
  
    verifyAddressInCheckout(expectedAddress)
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

  })

  it('updates address data', () => {
    cy.get('.MuiStack-root').contains('HOME').parent().parent().within(() => {
      FormHelper.clickFormButton("Edit");
    });

    FormHelper.updateFormFieldAndSubmit("Street", "Updated street");
  });

  it('deletes the address successfully', () => {
    FormHelper.deleteAddressByLabel("Home - test adress");
    verifyAddressNotExistByLabel('Home - test adress')

  });
});


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



function verifyAddressNotExistByLabel(label){
  cy.get('.MuiStack-root').should('not.contain.text', label);
}

function verifyAddressInCheckout(address) {
  cy.get(".MuiStack-root").contains('Address').parent().parent().within(() => {

    Object.values(address).forEach(value => {
      cy.get(".MuiGrid-root .MuiFormControl-root").should('contain.text', value)
    })
  })
}
