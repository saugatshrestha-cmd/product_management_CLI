import { inject, injectable } from "tsyringe";
import { FileMetadata } from "@mytypes/fileTypes";
import { FileRepositoryFactory } from "@factories/fileFactory";
import { FileRepository } from "@mytypes/repoTypes";
import { logger } from "@utils/logger";
import { AppError } from "@utils/errorHandler";

@injectable()
export class FileService {
    private fileRepository: FileRepository;
    constructor(
        @inject("FileRepositoryFactory") private fileRepositoryFactory: FileRepositoryFactory
    ) {
        this.fileRepository = this.fileRepositoryFactory.getRepository();
    }

    async saveFileMetadata(fileData: FileMetadata): Promise<FileMetadata> {
        try {
            const savedFile = await this.fileRepository.add(fileData);
            logger.info(`File metadata saved with ID: ${savedFile._id}`);
            return savedFile;
        } catch (error) {
            logger.error(`Failed to save file metadata: ${error instanceof Error ? error.message : String(error)}`);
            throw AppError.internal("Failed to save file metadata");
        }
    }

    async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
        try {
            const file = await this.fileRepository.findById(fileId);
            if (!file) {
                logger.warn(`File metadata not found for ID: ${fileId}`);
            }
            return file;
        } catch (error) {
            logger.error(`Failed to get file metadata: ${error instanceof Error ? error.message : String(error)}`);
            throw AppError.internal("Failed to retrieve file metadata");
        }
    }

    async updateFileMetadata(fileId: string, updates: Partial<FileMetadata>): Promise<FileMetadata> {
        try {
            if (!fileId) {
                throw AppError.badRequest("Invalid file ID");
            }

            // First perform the update
            await this.fileRepository.update(fileId, updates);
            
            // Then fetch the updated document
            const updatedFile = await this.fileRepository.findById(fileId);
            
            if (!updatedFile) {
                logger.warn(`File metadata not found after update: ${fileId}`);
                throw AppError.notFound("File metadata not found after update", fileId);
            }

            logger.info(`File metadata updated for ID: ${fileId}`);
            return updatedFile;
        } catch (error) {
            logger.error(`Failed to update file metadata: ${error instanceof Error ? error.message : String(error)}`);
            
            if (error instanceof AppError) {
                throw error;
            }
            
            throw AppError.internal("Failed to update file metadata");
        }
    }
}