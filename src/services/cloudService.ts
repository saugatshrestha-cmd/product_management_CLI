import { injectable } from "tsyringe";
import cloudinary from "@config/cloudinary";
import { FilePathGenerator } from '@utils/generateFilePath';
import { FileMetadata } from "@mytypes/fileTypes";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "@utils/logger";

@injectable()
export class CloudService {

    async upload(
        files: { buffer: Buffer; originalName: string }[],
        folderName: string
    ): Promise<FileMetadata[]> {
        return Promise.all(
            files.map(file => this.uploadSingle(file.buffer, folderName, file.originalName))
        );
    }

    private async uploadSingle(
        buffer: Buffer,
        folderName: string,
        originalName: string
    ): Promise<FileMetadata> {
        const fileType = originalName.split('.').pop() || '';
        const basePath = FilePathGenerator.generateFilePath(folderName, fileType);
        const uuid = uuidv4();
        const fileName = `${uuid}.${fileType}`;

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: basePath,
                    public_id: fileName,
                    resource_type: 'auto',
                    type: 'authenticated'
                },
                (error, result) => {
                    if (error || !result) {
                        logger.error('Upload failed:', error);
                        reject(error || new Error('Upload failed'));
                        return;
                    }
                    resolve({
                        originalName,
                        publicId: result.public_id,
                        fileType,
                        size: result.bytes,
                        url: result.secure_url
                    });
                }
            );
            uploadStream.end(buffer);
        });
    }

    async updateFile(
        fileBuffer: Buffer,
        folderName: string,
        originalName: string,
        existingPublicId: string
    ): Promise<FileMetadata> {
        const fileType = originalName.split('.').pop() || '';
        const basePath = FilePathGenerator.generateFilePath(folderName, fileType);
        const uuid = uuidv4();
        const fileName = `${uuid}.${fileType}`;

        return new Promise((resolve, reject) => {
            // Delete the old file first
            cloudinary.uploader.destroy(existingPublicId,
                {
                type: 'authenticated',
                resource_type: 'image' // Explicitly set for consistency
                },
                (deleteError, deleteResult) => {
                if (deleteError) {
                    logger.error(`Failed to delete existing file ${existingPublicId}:`, deleteError);
                    // Continue with upload even if deletion fails (failure-tolerant)
                    logger.warn(`Proceeding with upload despite deletion failure for ${existingPublicId}`);
                }

                // Upload the new file
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        public_id: fileName,
                        folder: basePath,
                        resource_type: 'auto',
                        type: 'authenticated'
                    },
                    (uploadError, uploadResult) => {
                        if (uploadError) {
                            logger.error('File upload failed:', uploadError);
                            return reject(new Error(`File upload failed: ${uploadError.message}`));
                        }
                        if (!uploadResult) {
                            logger.error('Upload returned no result');
                            return reject(new Error('Upload returned no result'));
                        }
                        logger.info(`Successfully updated file from ${existingPublicId} to ${uploadResult.public_id}`);
                        const metadata: FileMetadata = {
                            originalName,
                            publicId: uploadResult.public_id,
                            fileType,
                            size: uploadResult.bytes,
                            url: uploadResult.secure_url,
                        };
                        resolve(metadata);
                    }
                );
                uploadStream.end(fileBuffer);
            });
        });
    }

    async update(
        files: { buffer: Buffer; originalName: string }[],
        folderName: string,
        existingPublicIds: string[]
    ): Promise<FileMetadata[]> {
        const updatedFiles = await Promise.all(
            files.map((file, index) => 
                this.updateFile(file.buffer, folderName, file.originalName, existingPublicIds[index])
            )
        );
        return updatedFiles;
    }

    async deleteFile(publicId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!publicId || typeof publicId !== 'string') {
                logger.error('Invalid publicId provided');
                return reject(new Error('Invalid file identifier'));
            }

            cloudinary.uploader.destroy(
                publicId, 
                {
                    type: 'authenticated',
                },
                (error, result) => {
                    if (error) {
                        logger.error(`Cloudinary error: ${error.message}`);
                        return reject(error);
                    }
                    if (result?.result !== 'ok') {
                        logger.error(`Deletion failed. Full response:`, result);
                        return reject(new Error(`Failed to delete. Cloudinary response: ${JSON.stringify(result)}`));
                    }
                    logger.info(`Successfully deleted ${publicId}`);
                    resolve(true);
                }
            );
        });
    }

    async delete(publicIds: string[]): Promise<boolean[]> {
        const results = await Promise.all(
            publicIds.map(publicId => this.deleteFile(publicId))  // Calling the existing deleteFile method for each publicId
        );
        return results;
    }
}
