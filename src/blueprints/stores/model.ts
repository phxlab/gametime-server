import mongoose, { Document, Schema } from 'mongoose';
import Wave from '../waves/model';

interface StoreDocument extends Document {
  name: string;
  slug: string;
  waves: {
    open: string;
    close: string;
  }[];
  color: string;
  getOpenWaves(): { open: string; close: string }[];
}

const storeSchema = new Schema<StoreDocument>({
  name: {
    type: String,
    required: [true, 'Store name is required.'],
  },
  slug: {
    type: String,
    required: [true, 'Store slug is required.'],
    unique: true,
    minlength: 4,
    maxlength: 25,
    validate: {
      validator(value: string) {
        return /^[a-z0-9-]+$/.test(value);
      },
      message:
        'Store slug must be url-friendly alphanumeric lowercase with dashes.',
    },
  },
  color: {
    type: String,
    required: [true, 'Store color is required.'],
  },
});

storeSchema.virtual('waves', {
  ref: 'Wave', // This should match the model name of your Wave schema
  localField: '_id',
  foreignField: 'store',
});

storeSchema.pre('save', async function () {
  if (this.isNew) {
    const waveData = this.waves.map((wave) => ({
      store: this._id,
      open: wave.open,
      close: wave.close,
    }));

    await Wave.insertMany(waveData);
  }
});

storeSchema.methods.getOpenWaves = async function () {
  return Wave.find({ isClosed: false, store: this._id });
};

export default mongoose.model('Store', storeSchema);
