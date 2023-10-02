import { Document, model, Schema } from 'mongoose';

interface ItemDocument extends Document {
  name: string;
  slug: string;
  price: number;
  images: {
    primary: boolean;
    url: string;
  }[];
  sizes?: {
    name: string;
    price: number;
  }[];
  sizeChart?: string;
  customizations?: {
    name: string;
    price: number;
  }[];
  archived: boolean;
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
      match: [
        /^(?!-)[a-z0-9-]+(?!-)$/,
        'Slug must be alphanumeric and cannot start or end with a dash',
      ],
      required: [true, 'Slug is required.'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
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
    archived: {
      type: Boolean,
      default: false,
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

Item.path('images').validate(function (images: string[]) {
  return images.length > 0;
}, 'Image is required.');

Item.path('slug').validate(
  async function (slug) {
    const existingItem = await model('Item').findOne({
      slug,
      store: this.store,
      archived: false,
      _id: { $ne: this._id },
    });

    return !existingItem;
  },
  'Slug is already registered',
  'Conflict',
);

export default model('Item', Item);
