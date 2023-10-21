import { Document, model, Schema } from 'mongoose';

interface CategoryDocument extends Document {
  name: string;
  store: Schema.Types.ObjectId;
}

const Category = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required.'],
    },
  },
  {
    toJSON: { versionKey: false, virtuals: true },
  },
);

Category.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'categories',
  justOne: false,
});

export default model('Category', Category);
