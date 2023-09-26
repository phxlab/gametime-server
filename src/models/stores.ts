import { Document, model, Schema } from 'mongoose';
import { ErrorResponse } from 'hono-error-handler';

export interface StoreDocument extends Document {
  name: string;
  slug: string;
  color: string;
  archived: boolean;
  org: Schema.Types.ObjectId;
}

const Store = new Schema<StoreDocument>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  slug: {
    unique: false,
    type: String,
    required: [true, 'Slug is required.'],
    minlength: 4,
    maxlength: 25,
    match: [
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      'Slug must be alphanumeric and cannot start with a number',
    ],
  },
  color: {
    type: String,
    required: [true, 'Color is required.'],
  },
  archived: {
    type: Boolean,
    default: false,
  },
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: [true, 'Organization is required.'],
  },
});

Store.pre('save', async function (next) {
  // @ts-ignore
  const existingStore = await this.constructor.findOne({
    slug: this.slug,
    org: this.org,
  });

  if (existingStore && this.id !== existingStore.id) {
    next(new ErrorResponse('slug is already registered', 409));
  }

  next();
});

export default model('Store', Store);
