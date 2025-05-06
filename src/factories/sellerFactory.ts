import { injectable } from "tsyringe";
import { SellerRepository } from "@mytypes/repoTypes";
import { MongoSellerRepository } from "@repository/sellerRepo";

@injectable()
export class SellerRepositoryFactory {
    createRepository(): SellerRepository {
        return new MongoSellerRepository();
    }
}