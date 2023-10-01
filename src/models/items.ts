import { Document, model, Schema } from 'mongoose';

interface ItemDocument extends Document {
  name: string;
  slug: string;
  images: {
    primary: boolean;
    url: string;
  }[];
  sizes: {
    name: string;
    price: number;
  }[];
  sizeChart?: string;
  customizations: {
    name: string;
    price: number;
  }[];
  store: Schema.Types.ObjectId;
}

const Item = new Schema<ItemDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required.'],
    },
    images: [
      {
        primary: {
          type: Boolean,
          default: false,
        },
        url: String,
      },
    ],
    sizes: [
      {
        name: String,
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    sizeChart: String,
    customizations: [
      {
        name: String,
        price: Number,
      },
    ],
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

export default model('Item', Item);
