import ApiHelper from "../../support/apiHelper";

describe('When verifying login process', () => {
  context('When verifying normal user', () => {
    it('should login user with correct credentials using ApiHelper', () => {
      cy.fixture('auth/login_correct_credentials_payload').then((user) => {
        ApiHelper.requestLogIn(user.email, user.password).then((response) => {
          expect(response.status).to.eq(200);

          const res = response.body;

          expect(res).to.have.property('_id').and.to.be.a('string');
          expect(res).to.have.property('email', user.email);
          expect(res).to.have.property('isVerified', true);
          expect(res).to.have.property('isAdmin', false);
        });
      });
    });

    it('should fail to login with incorrect password (modified fixture)', () => {
      cy.fixture('auth/login_correct_credentials_payload').then((user) => {
        user.password = 'wrong!';
        ApiHelper.requestFailedLogin(user).then((response) => {
          expect(response.status).to.be.oneOf([400, 401, 404]);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.eq('Invalid Credentails');
        });
      });
    });

    it('should fail to login with incorrect email (modified fixture)', () => {
      cy.fixture('auth/login_correct_credentials_payload').then((user) => {
        user.email = 'wrongEmail@gmail.com';
        ApiHelper.requestFailedLogin(user).then((response) => {
          expect(response.status).to.be.oneOf([400, 401, 404]);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.eq('Invalid Credentails');
        });
      });
    });

    it('should correctly log out user', () => {
        ApiHelper.logout().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message', 'Logout successful');

          });
    })

    it('user should not acess shop page without authentication', () => {
        ApiHelper.checkAuth().then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body.message).to.eq('Token missing, please login again');
          });
    })
  });

  context('should verify admin user authentication', () => {
    it('should login admin with correct credentials using ApiHelper', () => {
      cy.fixture('auth/admin_login_correct_credentials_payload').then((user) => {
        user.email = Cypress.env("adminEmail");
        user.password = Cypress.env("adminPassword");
        ApiHelper.requestLogIn(user.email, user.password).then((response) => {
          expect(response.status).to.eq(200);

          const res = response.body;

          expect(res).to.have.property('_id').and.to.be.a('string');
          expect(res).to.have.property('email', user.email);
          expect(res).to.have.property('isVerified', true);
          expect(res).to.have.property('isAdmin', true);
        });
      });
    });

    it('should fail to login as admin with incorrect password', () => {
      cy.fixture('auth/admin_login_correct_credentials_payload').then((user) => {
        user.password = 'wrong!';
        ApiHelper.requestFailedLogin(user).then((response) => {
          expect(response.status).to.be.oneOf([400, 401, 404]);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.eq('Invalid Credentails');
        });
      });
    });

    it('should fail to login as admin with incorrect email', () => {
      cy.fixture('auth/admin_login_correct_credentials_payload').then((user) => {
        user.email = 'wrongEmail@gmail.com';
        ApiHelper.requestFailedLogin(user).then((response) => {
          expect(response.status).to.be.oneOf([400, 401, 404]);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.eq('Invalid Credentails');
        });
      });
    });

    it('should correctly log out user', () => {
        ApiHelper.logout().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message', 'Logout successful');
          });
    })

    it('user should not acess shop page without authentication', () => {
        ApiHelper.checkAuth().then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body.message).to.eq('Token missing, please login again');
          });
    })
  });
});
