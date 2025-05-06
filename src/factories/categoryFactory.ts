import { injectable } from "tsyringe";
import { CategoryRepository } from "@mytypes/repoTypes";
import { MongoCategoryRepository } from "@repository/categoryRepo";

@injectable()
export class CategoryRepositoryFactory {
    createRepository(): CategoryRepository {
        return new MongoCategoryRepository();
    }
}