import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
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
      message: 'Store slug must be url-friendly alphanumeric lowercase with dashes.',
    },
  },
  waves: [{
    open: {
      type: Date,
      required: [true, 'Wave open date is required.'],
    },
    close: {
      type: Date,
      required: [true, 'Wave close date is required.'],
    },
  }],
  color: {
    type: String,
    required: [true, 'Store color is required.'],
  },
});

const Store = mongoose.model('Store', storeSchema);

export default Store;
