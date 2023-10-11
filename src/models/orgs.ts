import { Document, model, Schema } from 'mongoose';

export interface OrgDocument extends Document {
  name: string;
  slug: string;
}

const Org = new Schema<OrgDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [4, 'Name must be at least 4 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      match: [
        /^(?!-)[a-z0-9-]+(?!-)$/,
        'Slug must be alphanumeric and cannot start with a number',
      ],
    },
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
  },
);

Org.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'org',
  justOne: false,
});

export default model('Org', Org);
