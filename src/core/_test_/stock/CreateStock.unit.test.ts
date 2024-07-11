import { Stock } from "../../entities/Stock";
import { StockRepository } from "../../repositories/StockRepository";
import { InMemoryStockRepository } from "../../adapters/repositories/InMemoryStockRepository";
import { CreateStockData } from "../../usecases/Stock/CreateStockData";
import { Location } from "../../types/LocationType";
import { StockDataRepository } from "../../repositories/StockDataRepository";
import { StockData } from "../../types/StockData";
import { InMemoryStockDataRepository } from "../../adapters/repositories/InMemoryStockDataRepository";
import { StockErrors } from "../../errors/StockErrors";

describe("Unit - create stock", () => {
  let stockRepository: StockRepository;
  let stockDataRepository: StockDataRepository;
  let createStock: CreateStockData;
  const stockDb = new Map<string, Stock>();
  const stockDataDb = new Map<string, StockData>();
  const productId = "product_id";
  const stockId = "stock_id";
  const quantity = 0;
  let stock: Stock
  let stock2: Stock

  beforeAll(async () => {
    stockRepository = new InMemoryStockRepository(stockDb);
    stockDataRepository = new InMemoryStockDataRepository(stockDataDb);
    createStock = new CreateStockData(stockRepository, stockDataRepository);
    stock = new Stock ({
      id: "id1",
      locationId: "location_id1",
      type: Location.STORE,
      stockDatas: [{
        productId, 
        quantity,
        stockId
      }],
      createdAt: new Date()
    })
    stock2 = new Stock ({
      id: "id2",
      locationId: "location_id2",
      type: Location.WAREHOUSE,
      stockDatas: [{
        productId, 
        quantity,
        stockId
      }],
      createdAt: new Date()
    })
  });

  afterEach(async () => {
    stockDb.clear();
  });

  it("Should create stock", async () => {
    stockDb.set(stock.props.id, stock);
    stockDb.set(stock2.props.id, stock2);

    const result = await createStock.execute({
      productId
    })

    const stockUpdated = stockDb.get(stock.props.id)
    const stockUpdated2 = stockDb.get(stock2.props.id)

    if(!stockUpdated || !stockUpdated2) {
      throw new StockErrors.NotFound()
    }
    
    expect(stockUpdated.props.stockDatas).toHaveLength(1);
    expect(stockUpdated2.props.stockDatas).toHaveLength(1)
  });
});