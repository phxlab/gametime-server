import { model, Schema } from 'mongoose';

export interface WaveDocument {
  name: string;
  open: Date;
  close: Date;
  isActive: boolean;
  store: Schema.Types.ObjectId;
}

const Wave = new Schema<WaveDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    open: {
      type: Date,
      required: [true, 'Open date is required.'],
    },
    close: {
      type: Date,
      required: [true, 'Close date is required.'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store binding is required.'],
    },
  },
  {
    toJSON: { versionKey: false },
  },
);

export default model('Wave', Wave);
