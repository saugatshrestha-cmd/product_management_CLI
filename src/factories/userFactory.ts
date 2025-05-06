import { injectable } from "tsyringe";
import { UserRepository } from "@mytypes/repoTypes";
import { MongoUserRepository } from "@repository/userRepo";

@injectable()
export class UserRepositoryFactory {
    createRepository(): UserRepository {
        return new MongoUserRepository();
    }
}