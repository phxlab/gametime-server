import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Wave extends Document {
  store: Types.ObjectId;
  open: string;
  close: string;
  isClosed: boolean;
}

const waveSchema = new Schema<Wave>({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', // Reference to the Store model
    required: true,
  },
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

const WaveModel = mongoose.model<Wave>('Wave', waveSchema);

export default WaveModel;
