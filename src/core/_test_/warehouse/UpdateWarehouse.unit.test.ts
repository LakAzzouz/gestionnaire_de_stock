import { Warehouse } from "../../entities/Warehouse";
import { WarehouseRepository } from "../../repositories/WarehouseRepository";
import { UpdateWarehouse } from "../../usecases/Warehouse/UpdateWarehouse";
import { InMemoryWarehouseRepository } from "../../adapters/repositories/InMemoryWarehouseRepository";
import { DataBuilders } from "../tools/DataBuilders";
import { WarehouseErrors } from "../../errors/WarehouseErrors";

describe("Unit - update warehouse", () => {
  let warehouseRepository: WarehouseRepository;
  let updateWarehouse: UpdateWarehouse;
  const warehouseDb = new Map<string, Warehouse>();
  const id = "id";
  const newNumberOfEmployees = 20;

  beforeAll(async () => {
    warehouseRepository = new InMemoryWarehouseRepository(warehouseDb);
    updateWarehouse = new UpdateWarehouse(warehouseRepository);
  });

  afterEach(async () => {
    warehouseDb.clear();
  });

  it("Should update warehouse", async () => {
    const warehouse = DataBuilders.generateWarehouse({});

    warehouseDb.set(warehouse.props.id, warehouse);

    const result = await updateWarehouse.execute({
      id: warehouse.props.id,
      newNumberOfEmployees,
    });

    expect(result.props.numberOfEmployees).toEqual(newNumberOfEmployees);
  });

  it("Should throw an error because the warehouse id is not found", async () => {
    const result = updateWarehouse.execute({
      id,
      newNumberOfEmployees,
    });

    await expect(result).rejects.toThrow(WarehouseErrors.NotFound);
  });
});
