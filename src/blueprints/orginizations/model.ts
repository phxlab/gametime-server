import { Schema, model } from 'mongoose';
interface OrgModel {
  name: string;
  slug: string;
}

const orgModel = new Schema<OrgModel>({
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

export default model('Org', orgModel);
