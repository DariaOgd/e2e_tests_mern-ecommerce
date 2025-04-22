class ApiHelper {
    static BASE_URL = Cypress.config('baseUrl_API');
  
    static requestLogIn(email, password) {
      return cy.request('POST', `${this.BASE_URL}/auth/login`, {
        email,
        password,
      });
    }
  
    static createProduct(productPayload) {
      return cy.request({
        method: 'POST',
        url: `${this.BASE_URL}/products`,
        body: productPayload,
        failOnStatusCode: false,
      });
    }
  
    static getProductById(productId) {
      return cy.request({
        method: 'GET',
        url: `${this.BASE_URL}/products/${productId}`,
      });
    }
  
    static updateProduct(productId, updatePayload) {
      return cy.request({
        method: 'PATCH',
        url: `${this.BASE_URL}/products/${productId}`,
        body: updatePayload,
      });
    }
  
    static deleteProduct(productId) {
      return cy.request({
        method: 'DELETE',
        url: `${this.BASE_URL}/products/${productId}`,
        failOnStatusCode: false,
      });
    }
  
    static addProductToCart(payload) {
      return cy.request({
        method: 'POST',
        url: `${this.BASE_URL}/cart`,
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    static updateCartItemQuantity(cartId, quantity) {
      return cy.request({
        method: 'PATCH',
        url: `${this.BASE_URL}/cart/${cartId}`,
        body: { quantity },
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    static deleteAllItemsFromCart(userId) {
      return cy.request({
        method: 'DELETE',
        url: `${this.BASE_URL}/cart/user/${userId}`,
        failOnStatusCode: false,
      });
    }
  
    static createOrderFromFixture(fixturePath = 'orders/checkout_with_cash_payload') {
      return cy.fixture(fixturePath).then((payload) => {
        return cy.request({
          method: 'POST',
          url: `${this.BASE_URL}/orders`,
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
          return { response, payload };
        });
      });
    }
  
    static createOrderFromFixtureWithFail(fixturePath) {
      return cy.fixture(fixturePath).then((payload) => {
        return cy.request({
          method: 'POST',
          url: `${this.BASE_URL}/orders`,
          body: payload,
          headers: { 'Content-Type': 'application/json' },
          failOnStatusCode: false,
        }).then((response) => {
          return { response, payload };
        });
      });
    }

    static requestFailedLogin(modifiedUser) {
      return cy.request({
        method: 'POST',
        url: `${this.BASE_URL}/auth/login`,
        body: modifiedUser,
        failOnStatusCode: false,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    static logout() {
      return cy.request({
        method: 'GET',
        url: `${this.BASE_URL}/auth/logout`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    static checkAuth() {
      return cy.request({
        method: 'GET',
        url: `${this.BASE_URL}/auth/check-auth`,
        failOnStatusCode: false,
      });
    }

    static registerUser(payload) {
      return cy.request({
        method: 'POST',
        url: `${this.BASE_URL}/auth/signup`,
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false,

      });
    }
    
    
    
    
  }
  
  export default ApiHelper;
  