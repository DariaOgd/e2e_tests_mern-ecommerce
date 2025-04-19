import ApiHelper from "../../support/apiHelper";

describe('When verifying register process', () => {
  it('should correctly register new user', () => {
    cy.fixture('register/register_new_user_payload').then((basePayload) => {
      const randomNum = Math.floor(Math.random() * 100000);
      const email = `new_user_${randomNum}@gmail.com`;

      const userPayload = {
        ...basePayload,
        email,
        password: Cypress.env("userPassword"),
      };

      ApiHelper.registerUser(userPayload).then((response) => {
        expect(response.status).to.eq(201);

        const res = response.body;
        expect(res).to.have.property('_id').and.to.be.a('string');
        expect(res).to.have.property('email', email);
        expect(res).to.have.property('isVerified', true);
        expect(res).to.have.property('isAdmin', false);
      });
    });
  });

  it('should not create a user with wrong email', () => {
    cy.fixture('register/register_new_user_payload').then((basePayload) => {
      const invalidPayload = {
        ...basePayload,
        email: 'invalid-email-format.com',
        password: Cypress.env("userPassword"),
      };

      ApiHelper.registerUser(invalidPayload).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('should not create a user with wrong password', () => {
    cy.fixture('register/register_new_user_payload').then((basePayload) => {
      const invalidPayload = {
        ...basePayload,
        password: 'wrongpassword',
      };

      ApiHelper.registerUser(invalidPayload).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  it('should fail for empty payload', () => {
    ApiHelper.registerUser({}).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property('message');
    });
  });

  it('should not allow registering with an already used email', () => {
    cy.fixture('register/register_new_user_payload').then((user) => {
      user.email = 'Pawel@gmail.com';
      user.password = Cypress.env("userPassword");

      ApiHelper.registerUser(user).then((response) => {
        expect(response.status).to.be.oneOf([400, 409]);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.include('already');
      });
    });
  });

  it('should not allow short passwords', () => {
    cy.fixture('register/register_new_user_payload').then((payload) => {
      payload.password = '123';

      ApiHelper.registerUser(payload).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
        expect(response.body).to.have.property('message');
      });
    });
  });

  it('should not allow missing name field', () => {
    cy.fixture('register/register_new_user_payload').then((payload) => {
      delete payload.name;
      payload.password = Cypress.env("userPassword");

      ApiHelper.registerUser(payload).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
        expect(response.body).to.have.property('message');
      });
    });
  });
});
