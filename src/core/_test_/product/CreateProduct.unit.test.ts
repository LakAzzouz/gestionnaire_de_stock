import { Product, ProductType } from "../../entities/Product";
import { ProductErrors } from "../../errors/ProductErrors";
import { MediaGateway } from "../../gateways/MediaGateway";
import { ProductRepository } from "../../repositories/ProductRepository";
import { CreateProduct } from "../../usecases/Product/CreateProduct";
import { InMemoryProductRepository } from "../../adapters/repositories/InMemoryProductRepository";

describe("Unit - Create product", () => {
  let productRepository: ProductRepository;
  let createProduct: CreateProduct;
  let mediaGateway: MediaGateway;
  const productDb = new Map<string, Product>();
  const shoesName = "Air Jordan";
  const size = 43;
  const price = 50;
  const image = `123456_${shoesName}`

  beforeAll(async () => {
    productRepository = new InMemoryProductRepository(productDb);
    createProduct = new CreateProduct(productRepository, mediaGateway);
  });

  afterEach(async () => {
    productDb.clear();
  });

  it("Should create a product", async () => {
    const result = await createProduct.execute({
      name: shoesName,
      productType: ProductType.SHOES,
      price,
      size,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.name).toEqual(shoesName);
    expect(result.props.productType).toEqual(ProductType.SHOES);
    expect(result.props.size).toEqual(size);
    expect(result.props.price).toEqual(price);
    expect(result.props.createdAt).toBeDefined();
  });

  it("Should save a product", async () => {
    const product = await createProduct.execute({
      name: shoesName,
      productType: ProductType.SHOES,
      price,
      size,
    });
    
    expect(productDb.get(product.props.id)).toEqual(product)
  })

  it("Should throw an error because the size is wrong", async () => {
    const result = createProduct.execute({
      name: shoesName,
      productType: ProductType.SHOES,
      price,
      size: 35,
    });
    await expect(result).rejects.toThrow(ProductErrors.SizeErrors);
  });

});