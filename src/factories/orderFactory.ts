import { injectable } from "tsyringe";
import { OrderRepository } from "@mytypes/repoTypes";
import { MongoOrderRepository } from "@repository/orderRepo";

@injectable()
export class OrderRepositoryFactory {
    createRepository(): OrderRepository {
        return new MongoOrderRepository();
    }
}