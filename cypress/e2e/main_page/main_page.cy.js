import CommonHelper from "../../support/commonHelper";
import CartCommands from "../../support/cartCommands";
import ApiHelper from "../../support/apiHelper";

describe('Main page functionality tests', () => {
  before(() => {
    ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

  })
  beforeEach(() => {
    cy.visit('/login');
    CommonHelper.LogIn(Cypress.env("userEmail"), Cypress.env("userPassword"))

  });


  it('sorts products by price (low to high and high to low)', () => {
    const sort_options = ['low to high', 'high to low'];
    sort_options.forEach((option) => {
      sortProducts(option);
      getFirstAndLastPrices().then((prices) => {
        validatePriceSorting(prices, option);
      });
    });
  });

  context('Adding products to cart from main page', () => {
    it('adds products to cart successfully', () => {
      CommonHelper.operateOnProductByIndex(0, () => {
        CommonHelper.addProductToCartFromMainPage();
        CommonHelper.captureNameAndPrice('name1', 'price1');
      });

      CommonHelper.operateOnProductByIndex(1, () => {
        CommonHelper.addProductToCartFromMainPage();
        CommonHelper.captureNameAndPrice('name2', 'price2');
      });

      cy.then(function () {
        const prices = [this.price1, this.price2];
        const subtotal = CartCommands.calculateSubtotal(prices);
        cy.wrap(subtotal).as('subtotal');
      });
    });

    it('verifies products and subtotal in cart', function () {
      CartCommands.openCartFromHeader();
      CartCommands.assertProductNamesInCart([this.name1, this.name2]);
      CartCommands.assertProductPricesInCart([this.price1, this.price2]);
      CartCommands.assertSubtotalInCart(this.subtotal);
    });

    after(() => {
      CartCommands.removeProductFromCart();
      CartCommands.removeProductFromCart();
      ApiHelper.deleteAllItemsFromCart(Cypress.env("user_ID"))

      
    });
  });

  context('Filtering products by brand', () => {
    it('filters products by selected brand', () => {
      cy.wait(3000);
      selectBrandFilter('Puma');
      cy.get('.MuiGrid-container .MuiPaper-root').then($els => {
        const lastIndex = $els.length - 1;
        const firstIndex = 0;

        CommonHelper.operateOnProductByIndex(lastIndex, () => {
          getProductBrand('Puma');
        });

        CommonHelper.operateOnProductByIndex(firstIndex, () => {
          getProductBrand('Puma');
        });
      });
    });

  });
});


function getPriceFromElement(element) {
  return element
    .invoke('text')
    .then((text) => parseFloat(text.replace(/[^0-9.]/g, '')));
}

function sortProducts(sortOption) {
  cy.get('[role="combobox"]').click();

  switch (sortOption) {
    case 'low to high':
      cy.get('.MuiList-root').find('li').contains('Price: low to high').click();
      break;
    case 'high to low':
      cy.get('.MuiList-root').find('li').contains('Price: high to low').click();
      break;
    case 'reset':
      cy.get('.MuiList-root').find('li').contains('Reset').click();
      break;
    default:
      throw new Error(`Invalid sort option: ${sortOption}`);
  }
}

function getFirstAndLastPrices() {
  const listPrices = [];

  return cy.get('.MuiGrid-root').within(() => {
    cy.get('.MuiPaper-root').first().within(() => {
      getPriceFromElement(cy.get('.MuiTypography-root').last()).then((price) => {
        listPrices.push(price);
        cy.log(`First Price: ${price}`);
      });
    });

    cy.get('.MuiPaper-root').last().within(() => {
      getPriceFromElement(cy.get('.MuiTypography-root').last()).then((price) => {
        listPrices.push(price);
        cy.log(`Last Price: ${price}`);
      });
    });
  }).then(() => listPrices);
}

function validatePriceSorting(listPrices, sortOrder) {
  cy.then(() => {
    cy.log(`All Prices: ${JSON.stringify(listPrices)}`);
    if (listPrices.length >= 2) {
      const firstPrice = listPrices[0];
      const lastPrice = listPrices[1];

      if (sortOrder === 'low to high') {
        expect(firstPrice).to.be.at.most(lastPrice);
      } else if (sortOrder === 'high to low') {
        expect(firstPrice).to.be.at.least(lastPrice);
      } else {
        throw new Error(`Invalid sort order: ${sortOrder}`);
      }
    } else {
      throw new Error('Not enough prices collected to compare sorting');
    }
  });
}

function getProductBrand(brand) {
  cy.get('p').eq(0).should('contain', brand);
}

function selectBrandFilter(brand) {
  cy.get('header').within(() => {
    cy.get('.MuiButtonBase-root').last().click();
  });

  cy.get('.MuiStack-root #brand-filters').contains('Brands').click();
  cy.get('[aria-labelledby="brand-filters"] .MuiFormControlLabel-root').contains(brand).click();
  cy.get('[data-testid="ClearIcon"]').click();
}

