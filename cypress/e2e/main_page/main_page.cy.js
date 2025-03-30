import CommonHelper from "../../support/commonHelper"
describe('Given main page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        const userEmail = 'Pawel@gmail.com'
        const userPassword =  'Password123!'
        CommonHelper.LogIn(userEmail, userPassword)
    })
    it('should contain products', () => {
        cy.get('.MuiGrid-root').within(() => {
            cy.get('.MuiPaper-root').first().within(() => {
                cy.get('button').should((btn) => {
                    const text = btn.text().trim();
                    expect(text).to.satisfy(t => t.includes('Added To cart') || t.includes('Add To Cart'));
                });
            });
        });
    });
    it('should sort elements from low to high', () => {
        const sort_options = ['low to high', 'high to low']
        sort_options.forEach((option) => {
            sortProducts(option);
    
            getFirstAndLastPrices().then((prices) => {
                validatePriceSorting(prices, option);
            });

        })
  
    });

    context('when veryfing left menu', () => {
        it.only('should check if left menu opens', () => {
            cy.wait(3000)
            cy.get('header').within(() => {
                cy.get('.MuiButtonBase-root').last().click()

                //to finish
 
            });

        })

    })
    
    
  

})

function getPriceFromElement(element) {
    return element
        .invoke('text') // Get the text content
        .then((text) => parseFloat(text.replace(/[^0-9.]/g, ''))); // Extract numeric price
}

function sortProducts(sortOption) {
    cy.get('[role="combobox"]').click(); // Open the dropdown

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

    cy.wait(1000); // Wait for the UI to update after sorting
}

function getFirstAndLastPrices() {
    const listPrices = [];

    return cy.get('.MuiGrid-root').within(() => {
        // Get first product price
        cy.get('.MuiPaper-root').first().within(() => {
            getPriceFromElement(cy.get('.MuiTypography-root').last()).then((price) => {
                listPrices.push(price);
                cy.log(`First Price: ${price}`);
            });
        });

        // Get last product price
        cy.get('.MuiPaper-root').last().within(() => {
            getPriceFromElement(cy.get('.MuiTypography-root').last()).then((price) => {
                listPrices.push(price);
                cy.log(`Last Price: ${price}`);
            });
        });
    }).then(() => listPrices); // Return collected prices
}

// ✅ Function to validate sorting order for both "low to high" and "high to low"
function validatePriceSorting(listPrices, sortOrder) {
    cy.then(() => {
        cy.log(`All Prices: ${JSON.stringify(listPrices)}`);
        console.log('All Prices:', listPrices);

        if (listPrices.length >= 2) {
            const firstPrice = listPrices[0];
            const lastPrice = listPrices[1];

            if (sortOrder === 'low to high') {
                expect(firstPrice).to.be.at.most(lastPrice); // Ensure ascending order
            } else if (sortOrder === 'high to low') {
                expect(firstPrice).to.be.at.least(lastPrice); // Ensure descending order
            } else {
                throw new Error(`Invalid sort order: ${sortOrder}`);
            }
        } else {
            throw new Error('Not enough prices collected to compare sorting');
        }
    });
}
