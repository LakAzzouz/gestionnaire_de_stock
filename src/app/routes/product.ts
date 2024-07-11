import express from "express";
import { CreateProduct } from "../../core/usecases/Product/CreateProduct";
import { Product } from "../../core/entities/Product";
import { GetProductById } from "../../core/usecases/Product/GetProductById";
import { GetProductByName } from "../../core/usecases/Product/GetProductByName";
import { UpdateProduct } from "../../core/usecases/Product/UpdateProduct";
import { DeleteProduct } from "../../core/usecases/Product/DeleteProduct";
import { ProductCreateCommand, ProductUpdateCommand } from "../validation/productCommands";
import { SqlProductRepository } from "../../adapters/repositories/SQL/SqlProductRepository";
import { SqlProductMapper } from "../../adapters/repositories/mappers/SqlProductMapper";
import multer from 'multer';
import { InMemoryProductRepository } from "../../core/adapters/repositories/InMemoryProductRepository";
import { initFirebase } from "../config/InitFirebase";
import { FirebaseStorageGateway } from "../../adapters/gateways/FirebaseStorageGateway";
import { db } from "../config/dbConfig";

export const productRouter = express.Router();

export const productDb = new Map<string, Product>();

const sqlProductRepository = new SqlProductRepository(db, new SqlProductMapper)
const productRepository = new InMemoryProductRepository(productDb)
const firebase = initFirebase()
const firebaseGateway = new FirebaseStorageGateway(firebase);

const createProduct = new CreateProduct(sqlProductRepository, firebaseGateway);
const getProductById = new GetProductById(sqlProductRepository);
const getProductByName = new GetProductByName(sqlProductRepository);
const updateProduct = new UpdateProduct(sqlProductRepository);
const deleteProduct = new DeleteProduct(sqlProductRepository);

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

productRouter.post("/", upload.single("file"), async (req: express.Request, res: express.Response) => {
    try {
      const body = JSON.parse(req.body.body)
      const { name, productType, price, size } = ProductCreateCommand.validateProductCreate(body);

      const product = await createProduct.execute({
        name,
        productType,
        file: req.file?.buffer,
        fileName: req.file?.originalname,
        mimetype: "jpg",
        price,
        size,
      });

      const result = {
        id: product.props.id,
        name,
        productType,
        price,
        size,
        createdAt: product.props.createdAt,
        image: product.props.image
      };

      res.status(201).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
    }
  }
);

productRouter.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const id = req.params.id;

      const product = await getProductById.execute({
        id,
      });

      const result = {
        id,
        name: product.props.name,
        productType: product.props.productType,
        price: product.props.price,
        size: product.props.size,
        createdAt: product.props.createdAt,
      };

      res.status(200).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
    }
  }
);

productRouter.get("/:name", async (req: express.Request, res: express.Response) => {
    try {
      const name = req.params.name;

      const product = await getProductByName.execute({
        name,
      });

      const result = {
        id: product.props.id,
        name,
        productType: product.props.productType,
        price: product.props.price,
        size: product.props.size,
        createdAt: product.props.createdAt,
      };

      res.status(200).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
    }
  }
);

productRouter.patch("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const { newPrice } = ProductUpdateCommand.updateProduct(req.body);
      const id = req.params.id;

      const product = await updateProduct.execute({
        id,
        price: newPrice,
      });

      const result = {
        id,
        name: product.props.name,
        productType: product.props.productType,
        price: newPrice,
        size: product.props.size,
        createdAt: product.props.createdAt,
        updateAt: product.props.updatedAt,
      };

      res.status(200).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
    }
  }
);

productRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const id = req.params.id;

      const product = await deleteProduct.execute({
        id,
      });

      const result = "Product deleted";

      res.status(202).send(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
    }
  }
);