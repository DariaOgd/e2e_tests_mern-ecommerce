import ApiHelper from '../../support/apiHelper';

describe('Cart', () => {
  before(() => {
    ApiHelper.requestLogIn('Pawel@gmail.com', 'Password123!');
  });

  let cartId;

  it('should add the product to the user’s cart and return the cart item - only one', () => {
    const payload = {
      product: '67713e8d65feefc82f4a989e',
      user: '6771210565feefc82f4a960d',
    };

    ApiHelper.addProductToCart(payload).then((response) => {
      expect(response.status).to.eq(201);
      const res = response.body;

      expect(res).to.have.property('_id');
      expect(res).to.have.property('quantity', 1);
      expect(res).to.have.property('user', payload.user);
      expect(res.product).to.have.property('_id', payload.product);
      expect(res.product).to.have.property('title', 'North face storm strke');
      expect(res.product).to.have.property('price', 250);
      expect(res.product).to.have.nested.property('brand.name', 'The North Face');
      expect(res.product.images).to.be.an('array').and.have.length.greaterThan(0);
      expect(res.product).to.have.property('isDeleted', false);
    });
  });

  it('should add the Nike product to the user’s cart and return the cart item', () => {
    const payload = {
      product: '677126bc65feefc82f4a96a0',
      user: '6771210565feefc82f4a960d',
    };

    ApiHelper.addProductToCart(payload).then((response) => {
      expect(response.status).to.eq(201);
      const res = response.body;
      cartId = res._id;

      expect(res).to.have.property('quantity', 1);
      expect(res.product).to.have.property('title', 'Nike');
      expect(res.product).to.have.property('price', 100);
      expect(res.product).to.have.nested.property('brand.name', 'Nike');
      expect(res.product.images).to.be.an('array').and.have.length.greaterThan(0);
    });
  });

  it('should increase the quantity of a product in the cart and calculate subtotal', () => {
    const expectedQuantity = 3;

    ApiHelper.updateCartItemQuantity(cartId, expectedQuantity).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('quantity', expectedQuantity);
      expect(res.body).to.have.property('product');
    });
  });

  it('should make the cart empty', () => {
    const userId = '6771210565feefc82f4a960d';
    ApiHelper.deleteAllItemsFromCart(userId).then((res) => {
      expect(res.status).to.eq(204);
    });
  });
});
