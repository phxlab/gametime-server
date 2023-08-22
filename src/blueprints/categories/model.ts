import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
