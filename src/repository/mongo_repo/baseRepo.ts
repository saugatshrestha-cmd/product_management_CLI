import { inject, injectable } from "tsyringe";
import { UserRepo } from "@mytypes/repoTypes";
import { UserRepository } from "./userRepo";
import { SellerRepo } from "@mytypes/repoTypes";
import { SellerRepository } from "./sellerRepo";
import { ProductRepo } from "@mytypes/repoTypes";
import { ProductRepository } from "./productRepo";
import { OrderRepo } from "@mytypes/repoTypes";
import { OrderRepository } from "./orderRepo";
import { CategoryRepo } from "@mytypes/repoTypes";
import { CategoryRepository } from "./categoryRepo";
import { CartRepo } from "@mytypes/repoTypes";
import { CartRepository } from "./cartRepo";

@injectable()
export class RepositoryFactory {
    constructor(
        @inject(UserRepository) private readonly userRepository: UserRepo,
        @inject(SellerRepository) private readonly sellerRepository: SellerRepo,
        @inject(ProductRepository) private readonly productRepository: ProductRepo,
        @inject(OrderRepository) private readonly orderRepository: OrderRepo,
        @inject(CategoryRepository) private readonly categoryRepository: CategoryRepo,
        @inject(CartRepository) private readonly cartRepository: CartRepo
    ) {}

    getUserRepository(): UserRepo {
        return this.userRepository;
    }

    getSellerRepository(): SellerRepo {
        return this.sellerRepository;
    }

    getProductRepository(): ProductRepo {
        return this.productRepository;
    }

    getOrderRepository(): OrderRepo {
        return this.orderRepository;
    }

    getCategoryRepository(): CategoryRepo {
        return this.categoryRepository;
    }

    getCartRepository(): CartRepo {
        return this.cartRepository;
    }
}