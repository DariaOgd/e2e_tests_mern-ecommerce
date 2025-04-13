import commonHelper from '../../support/commonHelper';
import AdminHelper from '../../support/adminHelper';
describe('Admin Product Management Flow', () => {
  let updatedTitle;

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    commonHelper.LogIn('Admin1@gmail.com', 'Password123!');
  });

  it('should verify if admin profile shows Admin label', () => {
    AdminHelper.assertAdminLabelVisible();
  });

  it('should allow admin to add a new product', () => {
    openProfileDropdownAndSelect('Add new Product');
    cy.url().should('include', '/add-product');

    const randomNumber = Math.floor(Math.random() * 100000);

    const newProduct = {
      title: `Example Product Title ${randomNumber}`,
      description: 'This is an example product description.',
      price: '199.99',
      discountPercentage: '10',
      stockQuantity: '50',
      thumbnail: 'https://example.com/image.jpg',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg'
      ],
      brand: 'Asics',
      category: 'Socks'
    };

    AdminHelper.fillProductFormFields(newProduct);
    AdminHelper.clickFormButton('Add Product');
    assertProductVisibleInList(newProduct.title);
  });

  it('should update the title of the last added product', () => {
    updatedTitle = "Edited Product " + Math.floor(Math.random() * 100000);
    getLastProductCard().contains('Update').click();
    AdminHelper.updateProductTitleField(updatedTitle);
    assertProductVisibleInList(updatedTitle);
  });

  it.skip('should delete the last added product', () => {
    deleteLastProduct();
    assertProductNotVisibleInList(updatedTitle);
  });
});


// 🔧 Reusable Helper Functions



function openProfileDropdownAndSelect(option) {
  cy.get('header').within(() => {
    cy.get('.MuiAvatar-root').click();
  });
  cy.get('ul[role="menu"]').contains(option).click();
}

function getLastProductCard() {
  return cy.get('.MuiGrid-root .MuiStack-root').last();
}


function deleteLastProduct() {
  getLastProductCard().contains('Delete').click();
}

function assertProductVisibleInList(title) {
  cy.get('.MuiGrid-root').should('contain', title);
}

function assertProductNotVisibleInList(title) {
  cy.get('.MuiGrid-root .MuiStack-root').should('not.contain', title);
}

