import ApiHelper from "../../support/apiHelper";

describe('When verifying login process', () => {
  context('When verifying normal user', () => {
    const userEmail = Cypress.env("userEmail");
    const userPassword = Cypress.env("userPassword");

    it('should login user with correct credentials using ApiHelper', () => {
      ApiHelper.requestLogIn(userEmail, userPassword).then((response) => {
        expect(response.status).to.eq(200);

        const res = response.body;

        expect(res).to.have.property('_id').and.to.be.a('string');
        expect(res).to.have.property('email', userEmail);
        expect(res).to.have.property('isVerified', true);
        expect(res).to.have.property('isAdmin', false);
      });
    });

    it('should fail to login with incorrect password', () => {
      ApiHelper.requestFailedLogin({ email: userEmail, password: 'wrong!' }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 404]);
        expect(response.body).to.have.property('message', 'Invalid Credentails');
      });
    });

    it('should fail to login with incorrect email', () => {
      ApiHelper.requestFailedLogin({ email: 'wrongEmail@gmail.com', password: userPassword }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 404]);
        expect(response.body).to.have.property('message', 'Invalid Credentails');
      });
    });

    it('should correctly log out user', () => {
      ApiHelper.logout().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Logout successful');
      });
    });

    it('user should not access shop page without authentication', () => {
      ApiHelper.checkAuth().then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Token missing, please login again');
      });
    });
  });

  context('should verify admin user authentication', () => {
    const adminEmail = Cypress.env("adminEmail");
    const adminPassword = Cypress.env("adminPassword");

    it('should login admin with correct credentials using ApiHelper', () => {
      ApiHelper.requestLogIn(adminEmail, adminPassword).then((response) => {
        expect(response.status).to.eq(200);

        const res = response.body;

        expect(res).to.have.property('_id').and.to.be.a('string');
        expect(res).to.have.property('email', adminEmail);
        expect(res).to.have.property('isVerified', true);
        expect(res).to.have.property('isAdmin', true);
      });
    });

    it('should fail to login as admin with incorrect password', () => {
      ApiHelper.requestFailedLogin({ email: adminEmail, password: 'wrong!' }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 404]);
        expect(response.body).to.have.property('message', 'Invalid Credentails');
      });
    });

    it('should fail to login as admin with incorrect email', () => {
      ApiHelper.requestFailedLogin({ email: 'wrongEmail@gmail.com', password: adminPassword }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 404]);
        expect(response.body).to.have.property('message', 'Invalid Credentails');
      });
    });

    it('should correctly log out user', () => {
      ApiHelper.logout().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Logout successful');
      });
    });

    it('user should not access shop page without authentication', () => {
      ApiHelper.checkAuth().then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Token missing, please login again');
      });
    });
  });
});
