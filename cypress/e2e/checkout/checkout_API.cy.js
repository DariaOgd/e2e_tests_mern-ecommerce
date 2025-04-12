import ApiHelper from '../../support/apiHelper';

describe('Should verify checkout process', () => {
  before(() => {
    ApiHelper.requestLogIn('Pawel@gmail.com', 'Password123!');
  });

  const paymentMethods = [
    { paymentType: 'cash', paymentCode: 'COD', fixture: 'orders/checkout_with_cash_payload' },
    { paymentType: 'card', paymentCode: 'CARD', fixture: 'orders/checkout_with_card_payload' },
  ];

  paymentMethods.forEach(({ paymentType, paymentCode, fixture }) => {
    it(`should verify checkout process with ${paymentType}`, () => {
      ApiHelper.createOrderFromFixture(fixture).then(({ response, payload }) => {
        expect(response.status).to.eq(201);
        const res = response.body;

        expect(res).to.have.property('user', payload.user);
        expect(res).to.have.property('paymentMode', paymentCode);
        expect(res).to.have.property('status', 'Pending');
        expect(res).to.have.property('total', payload.total);
        expect(res).to.have.property('createdAt');
        expect(res.item[0].product).to.have.property('price', 250);
        expect(res.item[0].product).to.have.property('title', 'North face storm strke');

        expect(res.address[0]).to.include({
          city: payload.address.city,
          country: payload.address.country,
          type: payload.address.type,
        });

        expect(res.item).to.be.an('array').and.have.length.greaterThan(0);
      });
    });
  });

  it('checkout should fail for incorrect payment field', () => {
    ApiHelper.createOrderFromFixtureWithFail('orders/checkout_with_incorrect_payment_type').then(({ response }) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property('message', 'Error creating an order, please trying again later');
    });
  });

  it.skip('checkout should fail for incorrect address provided', () => {
    ApiHelper.createOrderFromFixtureWithFail('orders/checkout_with_incorrect_address_payload').then(({ response }) => {
      expect(response.status).to.not.eq(201);
      expect(response.status).to.be.oneOf([400, 422, 500]);
    });
  });
});
