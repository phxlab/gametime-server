import { model, Schema } from 'mongoose';

interface CategoryDocument {
  name: string;
  item: Schema.Types.ObjectId;
}

const Category = new Schema<CategoryDocument>({
  name: {
    type: String,
    require: [true, 'Name is required'],
  },
  item: {
    type: Schema.Types.ObjectId,
  },
});

export default model('Category', Category);
