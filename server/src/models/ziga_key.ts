import Mongoose, { Document, Model, Schema } from 'mongoose';

export interface IZigaKeyDocument extends Document {
  token: string;
  phone: string;
  expire: number;
  startUse?: string
}

export interface IZigaModel extends Model<IZigaKeyDocument> {
  test(): void;
}

const ZigaKeySchema: Schema = new Schema(
  {
    phone: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expire: { type: Number, required: true },
    startUse: { type: String, default: null  },
  },
  { timestamps: true }
);

const ModelZiga = Mongoose.model<IZigaKeyDocument, IZigaModel>(
  'ziga_key',
  ZigaKeySchema
);

export default ModelZiga;
