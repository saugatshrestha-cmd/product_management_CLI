import { injectable } from "tsyringe";
import { ProductRepository } from "@mytypes/repoTypes";
import { MongoProductRepository } from "@repository/productRepo";

@injectable()
export class ProductRepositoryFactory {
    createRepository(): ProductRepository {
        return new MongoProductRepository();
    }
}