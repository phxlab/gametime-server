import { Document, model, Schema } from 'mongoose';

interface CategoryDocument extends Document {
  name: string;
  store: Schema.Types.ObjectId;
}

const Category = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      require: [true, 'Name is required'],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required.'],
    },
  },
  {
    toJSON: { versionKey: false },
  },
);

export default model('Category', Category);
