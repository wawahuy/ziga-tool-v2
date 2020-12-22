import Mongoose, { Document, Model, Schema } from 'mongoose';

export interface IZigaReleaseDocument extends Document {
  download?: string
}

export interface IZigaReleaseModel extends Model<IZigaReleaseDocument> {
  test(): void;
}

const ZigaReleaseSchema: Schema = new Schema(
  {
    download: { type: String },
  },
  { timestamps: true }
);

const ModelZiga = Mongoose.model<IZigaReleaseDocument, IZigaReleaseModel>(
  'ziga_release',
  ZigaReleaseSchema
);

export default ModelZiga;
