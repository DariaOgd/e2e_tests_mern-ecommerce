import commonHelper from '../../support/commonHelper';
import AdminHelper from '../../support/adminHelper';

describe('Admin Product Management Flow', () => {
  let updatedTitle;
  let randomNumber;

  context("when veryfing admin", () => {
    beforeEach(() => {
      cy.visit('/login');
      commonHelper.LogIn(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
    });

    it('should verify if admin profile shows Admin label', () => {
      AdminHelper.assertAdminLabelVisible();
    });

    it('should allow admin to add a new product', () => {
      commonHelper.openProfileDropdownAndSelect('Add new Product');
      cy.wait(2000)
      cy.url().should('include', '/add-product');

      randomNumber = Math.floor(Math.random() * 100000);

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
      AdminHelper.fillProductFormFields(newProduct)
      AdminHelper.clickFormButton('Add Product');
      AdminHelper.assertProductVisibleInAdminDashboardList(newProduct.title);
    });

    it('should update the title of the last added product', () => {
      updatedTitle = "Edited Product " + Math.floor(Math.random() * 100000);
      getLastProductCard().contains('Update').click();
      AdminHelper.updateProductTitleField(updatedTitle);
      AdminHelper.assertProductVisibleInAdminDashboardList(updatedTitle);
    });

    it('should delete the last added product', () => {
      deleteLastProduct();
    });

  });

  context('When veryfing end user', () => {
    beforeEach(() => {
      cy.visit('/login');
      commonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"));
    });

    it('user should not see admin deleted product', () => {
      const deletedTitle = `Example Product Title ${randomNumber}`;
      AdminHelper.verifyProductNotExist(deletedTitle)
    });
  });
});

describe('E2E flow: Admin adds product, user sees it', () => {
  let productTitle;
  it('should let admin add a product and user see it on homepage', () => {
    const random = Math.floor(Math.random() * 100000);
    productTitle = `Test Product E2E ${random}`;
    const newProduct = {
      title: productTitle,
      description: 'E2E product description.',
      price: '129.99',
      discountPercentage: '5',
      stockQuantity: '20',
      thumbnail: 'https://example.com/e2e-thumb.jpg',
      images: [
        'https://example.com/e2e1.jpg',
        'https://example.com/e2e2.jpg',
        'https://example.com/e2e3.jpg',
        'https://example.com/e2e4.jpg'
      ],
        brand: 'Asics',
        category: 'Socks'
    };

    cy.visit('/login');
    
    commonHelper.LogIn(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
    commonHelper.selectUserMenuOption('Add new Product')
    AdminHelper.fillProductFormFields(newProduct);
    AdminHelper.clickFormButton('Add Product');
    AdminHelper.assertProductVisibleInAdminDashboardList(productTitle);

    commonHelper.Logout()

    cy.visit('/login');
    commonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"));
    AdminHelper.assertProductIsVisibleOnMainPage(productTitle)
  });
  after(() => {
    commonHelper.Logout()
    cy.visit('/login');
    commonHelper.LogIn(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
    cy.wait(1000);
    clickNextUntilDisabled()

    deleteLastProduct();
  });
});



function getLastProductCard() {
  return cy.get('.MuiGrid-root .MuiStack-root').last();
}

function deleteLastProduct() {
  getLastProductCard().contains('Delete').click();
}


function clickNextUntilDisabled() {
  cy.get('[aria-label="pagination navigation"] li').last().find('button')
    .then($btn => {
      if (!$btn.is(':disabled')) {
        cy.wrap($btn).click();
        cy.wait(500); // opcjonalnie, żeby dać czas na załadowanie nowej strony
        clickNextUntilDisabled(); // wywołanie rekurencyjne
      } else {
        cy.log('Pagination end reached.');
      }
    });
}

