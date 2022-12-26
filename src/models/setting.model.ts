import mongoose, { Schema, Model, Document } from 'mongoose';

export type SettingDocument = Document & {
  name: string;
  value: string;
  user: { id: string };
};

export type SettingInput = {
  name: SettingDocument['name'];
  value: SettingDocument['value'];
  user: { id: string };
};

const settingSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    value: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      id: { type: Schema.Types.String },
    }
  },
  {
    collection: 'settings',
    timestamps: true,
  },
);

export const Setting: Model<SettingDocument>
  = mongoose.model<SettingDocument>('Setting', settingSchema);
