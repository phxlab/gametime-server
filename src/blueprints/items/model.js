const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required.'],
  },
  sizes: [{
    size: String,
    additionalPrice: Number,
  }],
  price: {
    type: Number,
    required: [true, 'Item price is required.'],
  },
  images: [{
    url: {
      type: String,
      required: [true, 'Image URL is required.'],
    },
  }],
  customizations: [{
    title: String,
    price: Number,
  }],
  sizeChart: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category reference is required.'],
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store reference is required.'],
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
