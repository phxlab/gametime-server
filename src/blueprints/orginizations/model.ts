import { Schema, model } from 'mongoose';
export interface OrgModelDocument {
  name: string;
  slug: string;
}

const OrgModel = new Schema<OrgModelDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
  },
});

export default model('Org', OrgModel);
