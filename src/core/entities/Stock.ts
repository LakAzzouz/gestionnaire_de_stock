import { v4 } from "uuid";
import { Location } from "../types/LocationType";
import { StockData } from "./StockData";

export type StockProperties = {
  id: string;
  locationId: string;
  type: Location;
  stockDatas: StockData[];
  createdAt: Date;
  updatedAt?: Date;
};

export class Stock {
  props: StockProperties;

  constructor(stockProperties: StockProperties) {
    this.props = stockProperties;
  }

  static initiate(props: {locationId: string, type: Location, stockDatas: StockData[]}): Stock {
    const stock = new Stock({
      id: v4(),
      locationId: props.locationId,
      type: props.type,
      stockDatas: props.stockDatas,
      createdAt: new Date()
    });
    return stock;
  }

  static createStockDatas(props: {productId: string, stockIds: string[]}): StockData[] {
    const {productId, stockIds} = props;

    let stockDatas: StockData[] = [];

    for (const stockId of stockIds) {
      const stockData = StockData.create({
        productId,
        stockId,
      })

      stockDatas.push(stockData);
    }
    
    return stockDatas;
  }
}