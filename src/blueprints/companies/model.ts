import { Schema, model } from 'mongoose';
interface CompanyDocument {
  name: string;
  slug: string;
}

const companyModel = new Schema<CompanyDocument>({
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

export default model('Company', companyModel);
