import { FileMetadata } from "@mytypes/fileTypes";
import { FileRepository } from "@mytypes/repoTypes";
import { injectable } from "tsyringe";
import { FileModel } from "@models/fileModel";

@injectable()
export class MongoFileRepository implements FileRepository {

    async add(fileData: FileMetadata): Promise<FileMetadata> {
        const file = new FileModel(fileData);
        await file.save();
        return file.toObject();
    }

    async findById(fileId: string): Promise<FileMetadata | null> {
        return await FileModel.findOne({ _id: fileId });
    }

    async update(fileId: string, updatedInfo: Partial<FileMetadata>): Promise<void>{
        await FileModel.updateOne({ _id: fileId }, updatedInfo);
    };

    async getAll(): Promise<FileMetadata[]>{
        return await FileModel.find();
    };

}