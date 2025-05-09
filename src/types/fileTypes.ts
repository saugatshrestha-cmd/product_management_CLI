export interface FileMetadata {
    _id?: string;
    originalName: string;
    publicId: string;
    fileType: string;
    size: number;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

