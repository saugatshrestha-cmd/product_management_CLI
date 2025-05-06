import { injectable } from "tsyringe";
import { CartRepository } from "@mytypes/repoTypes";
import { MongoCartRepository } from "@repository/cartRepo";

@injectable()
export class CartRepositoryFactory {
    createRepository(): CartRepository {
        return new MongoCartRepository();
    }
}