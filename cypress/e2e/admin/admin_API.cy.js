import ApiHelper from "../../support/apiHelper";

describe('Admin API Login', () => {
  before(() => {
    ApiHelper.requestLogIn('Admin1@gmail.com', 'Password123!');
  });

  let productId;

  it('should create a new product and return product data', () => {
    cy.fixture('admin/product_add_payload').then((productPayload) => {
      ApiHelper.createProduct(productPayload).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('_id');
        productId = response.body._id;
        expect(response.body.title).to.eq(productPayload.title);
        expect(response.body.brand).to.eq(productPayload.brand);
        expect(response.body.category).to.eq(productPayload.category);
        expect(response.body.price).to.eq(productPayload.price);
        expect(response.body.images.length).to.eq(productPayload.images.length);
      });
    });
  });

  it('should add newly added product', () => {
    ApiHelper.getProductById(productId).then((response) => {
      expect(response.status).to.eq(200);

      const product = response.body;

      expect(product).to.have.property('title').to.be.eq("CLUB II ERA - Sneakersy niskie");
      expect(product).to.have.property('price').to.be.eq(250);
      expect(product).to.have.property('description');
      expect(product).to.have.property('stockQuantity');
      expect(product.stockQuantity).to.be.greaterThan(0);
      expect(product).to.have.property('images').and.to.be.an('array');
    });
  });

  it('should update product price via PATCH and return updated data', () => {
    const updatedPrice = 277;

    ApiHelper.updateProduct(productId, { price: updatedPrice }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('_id', productId);
      expect(res.body.price).to.eq(updatedPrice);
      expect(res.body.updatedAt).to.exist;
    });
  });

  it('should delete the product and return the deleted product data', () => {
    ApiHelper.deleteProduct(productId).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('_id', productId);
      expect(response.body).to.have.property('isDeleted', true);
    });
  });
});

describe.skip('should check if non-admin user can not add perform admin crud operations', () => {
  before(() => {
    ApiHelper.requestLogIn('Pawel@gmail.com', 'Password123!');
  });

  it('should not be possible to add a product', () => {
    cy.fixture('product/new_product_payload').then((productPayload) => {
      ApiHelper.createProduct(productPayload).then((response) => {
        expect(response.status).to.not.eq(201);
      });
    });
  });
});





