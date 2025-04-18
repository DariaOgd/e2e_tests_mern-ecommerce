class CommonHelper {
    static LogIn(userEmail, userPassword) {
        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type(userPassword);
        cy.intercept('POST', 'http://localhost:8000/auth/login').as('loginRequest');
        cy.get('.MuiButtonBase-root').contains('Login').click();
        cy.wait('@loginRequest').then((interception) => {
            const statusCode = interception.response.statusCode;
            expect([200, 401, 404]).to.include(statusCode);
        });
    }
    
    static Logout() {
        cy.intercept('GET', '/auth/logout').as('logoutRequest');
        cy.get('header').within(() => {
            cy.get('[aria-label="Open settings"]').click();
        });
        cy.get('.MuiMenu-list').should('be.visible', { timeout: 20000 }).within(() => {
            cy.contains('Logout').click();
        });
        cy.wait('@logoutRequest'); // No assertion, just waits for the request
    }
    
    static verifyToastModal(expectedMessage) {
        cy.get('.Toastify .Toastify__toast-body').should('be.visible').then(($toast) => {
            const toastText = $toast.text().trim();
            switch (expectedMessage.toLowerCase()) {
                case 'login successful':
                    expect(toastText).to.include('Login successful');
                    break;
    
                case 'invalid credentials':
                    expect(toastText).to.include('Invalid Credentials');
                    break;
    
                case 'logout successful':
                    expect(toastText).to.include('Logged out successfully');
                    break;
                case 'user already exist':
                    expect(toastText).to.include('User already exist!');
                    break;
        
    
                default:
                    throw new Error(`Unexpected toast message: ${toastText}`);
            }
        });
    }

    
static Register(userName, userEmail, userPassword, canFail = false) {
    cy.get('input[placeholder="Username"]').type(userName);
    cy.get('input[placeholder="Email"]').type(userEmail);
    cy.get('input[placeholder="Password"]').type(userPassword);
    cy.get('input[placeholder="Confirm Password"]').type(userPassword);
    
    cy.intercept('POST', '**/auth/signup').as('signupRequest');
    cy.get('.MuiButtonBase-root').contains('Signup').click();

    // Wait for 500ms to allow UI to react
    // Check if the request was sent
    cy.get('@signupRequest.all').then((requests) => {
        if (requests.length > 0) {
            // If the request was made, wait for it and check response
            cy.wait('@signupRequest').then((interception) => {
                const statusCode = interception.response.statusCode;
                if (canFail) {
                    expect([200, 201, 400, 401, 404]).to.include(statusCode);
                } else {
                    expect([200, 201]).to.include(statusCode);
                }
            });
        } else {
            // If no request occurred, allow only if canFail is true
            if (!canFail) {
                throw new Error('Expected API request but none occurred!');
            }
        }
    });
}


static verifyUserNameIsCorrectlyDisplayedInHeader(userName) {
    cy.get('header').within(() => {
        cy.get('a').should('contain', 'MERN SHOP'); // Ensures the store name exists
        cy.get('.MuiStack-root').should('contain', `Hey👋, ${userName}`); // Checks if the username is displayed correctly
    });
}

static operateOnProductByIndex(index = 0, callback) {
    cy.get('.MuiGrid-container .MuiPaper-root')
      .eq(index)
      .within(() => {
        callback();
      });
  }

  static addProductToCartFromMainPage() {
    cy.contains('Add To Cart').click();
    cy.contains('Added to cart').should('be.visible');
  }

  static openProfileDropdownAndSelect(option) {
    cy.get('header').within(() => {
      cy.get('.MuiAvatar-root').click();
    });
    cy.get('ul[role="menu"]').contains(option).click();
  }

  static captureNameAndPrice(nameAlias, priceAlias) {
    cy.get('h6').first().invoke('text').as(nameAlias);
    cy.get('p').eq(1).invoke('text').as(priceAlias);
  }
  
    

}

export default CommonHelper;
