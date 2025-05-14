import { injectable, inject } from "tsyringe";
import { CategoryRepository } from "@mytypes/repoTypes";
import { AppError } from "@utils/errorHandler";
import { Category } from "@mytypes/categoryTypes";
import { CategoryRepositoryFactory } from "@factories/categoryFactory";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(
    @inject("CategoryRepositoryFactory") private categoryRepositoryFactory: CategoryRepositoryFactory,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.categoryRepository = this.categoryRepositoryFactory.getRepository();
  }
  async createCategory(categoryData: Category, req?: Request): Promise<{ message: string }> {
    try {
      const { name, description } = categoryData;
    if (await this.categoryRepository.findByName(name)) {
      logger.warn("Category not found");
      throw AppError.conflict( "Category already exists" )
    }
    await this.categoryRepository.add(categoryData);
    await this.auditService.logAudit({
        action: 'create_category',
        entity: 'Category',
        entityId: categoryData._id,
        status: 'success',
        message: 'Category added successfully',
        req
      });
    return { message: "Category added successfully" };
  }catch(error:any){
    await this.auditService.logAudit({
        action: 'create_category',
        entity: 'Category',
        entityId: categoryData._id,
        status: 'failed',
        message: error.message,
        req
      });
      logger.error("Unexpected error while creating category", error);
      throw AppError.internal("Something went wrong while creating the category");
  }
  }

  async getCategoryById(categoryId: string): Promise<Category | { message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      logger.warn("Category not found");
      throw AppError.notFound("Category not found", categoryId);
    }
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async updateCategory(categoryId: string, updatedInfo: Partial<Category>, req?: Request): Promise<{ message: string }> {
    try{
      const oldCategory = await this.categoryRepository.findById(categoryId);
    if (!oldCategory) {
      logger.warn("Category not found");
      throw AppError.notFound("Category not found", categoryId);
    }
    if (updatedInfo.name && await this.categoryRepository.findByName(updatedInfo.name)) {
      throw AppError.conflict( "Category already exists" );
    }
    const updatedCategory = await this.categoryRepository.update(categoryId, updatedInfo);
    await this.auditService.logAudit({
        action: 'update_category',
        entity: 'Category',
        entityId: categoryId,
        status: 'success',
        beforeState: oldCategory,
        afterState: updatedCategory,
        message: 'Category updated successfully',
        req
      });
    return { message: "Category updated successfully" };
  }catch(error:any){
    await this.auditService.logAudit({
        action: 'update_category',
        entity: 'Category',
        entityId: categoryId,
        status: 'failed',
        message: error.message,
        req
      });
      logger.error("Unexpected error while updating category", error);
      throw AppError.internal("Something went wrong while updating the category");
  }
  }

  async deleteCategory(categoryId: string, req?: Request): Promise<{ message: string }> {
    try{
      const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      logger.warn("Category not found");
      throw AppError.notFound("Category not found", categoryId);
    }
    const success = await this.categoryRepository.deleteCategoryById(categoryId);
    await this.auditService.logAudit({
        action: 'delete_category',
        entity: 'Category',
        entityId: categoryId,
        status: 'success',
        message: 'Category deleted',
        req
      });  
    return { message: "Category deleted successfully" };
  }catch(error:any){
    await this.auditService.logAudit({
        action: 'delete_category',
        entity: 'Category',
        entityId: categoryId,
        status: 'failed',
        message: error.message,
        req
      });
      logger.error("Unexpected error while deleting category", error);
      throw AppError.internal("Something went wrong while deleting the category");
  }
  }
}
