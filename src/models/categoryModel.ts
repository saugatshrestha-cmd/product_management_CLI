import mongoose, { Schema, Document, Model } from 'mongoose';

interface CategoryDocument extends Document {
    name: string;
}


const categorySchema = new Schema<CategoryDocument>({
    name: {
        type: String,
        required: true,
    }
});

const CategoryModel: Model<CategoryDocument>  = mongoose.model<CategoryDocument>('Category', categorySchema);

export default CategoryModel;
