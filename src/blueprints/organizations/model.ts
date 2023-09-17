import { Schema, model } from 'mongoose';
export interface OrgModelDocument {
  name: string;
  slug: string;
}

const OrgModel = new Schema<OrgModelDocument>({
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
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      'Slug must be alphanumeric and cannot start with a number',
    ],
  },
});

export default model('Org', OrgModel);
