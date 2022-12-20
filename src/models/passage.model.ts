import mongoose, { Schema, Model, Document } from 'mongoose';

export type PassageDocument = Document & {
  prompt: string;
  reference: string;
  reviewDates: Date[];
  latestReviewDate?: Date;
  text: string;
  user: { id: string };
};

export type PassageInput = {
  prompt: PassageDocument['prompt'];
  reference: PassageDocument['reference'];
  reviewDates: PassageDocument['reviewDates'];
  latestReviewDate?: PassageDocument['latestReviewDate'];
  text: PassageDocument['text'];
  user: {
    id: string,
  };
};

const passageSchema = new Schema(
  {
    prompt: {
      type: Schema.Types.String,
      required: true,
    },
    reference: {
      type: Schema.Types.String,
      required: true,
    },
    reviewDates: {
      type: Schema.Types.Array,
      required: true,
    },
    text: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      id: {
        type: Schema.Types.String,
        required: true,
      },
    }
  },
  {
    collection: 'passages',
    timestamps: true,
  },
);

export const Passage: Model<PassageDocument>
  = mongoose.model<PassageDocument>('Passage', passageSchema);

export interface PassageReviewList {
  daily: PassageDocument[],
  weekly: PassageDocument[],
  monthly: PassageDocument[],
  yearly: PassageDocument[],
  all: PassageDocument[],
}
