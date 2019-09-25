import * as _ from 'lodash';
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const SkillItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const SkillSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      index: true,
    },
    skills: [SkillItemSchema],
  },
  { timestamps: true },
);

const sanitizableFields = ['_id'];

SkillItemSchema.methods.sanitize = function() {
  return this.toObject({
    transform: (doc, ret, options) => {
      return { id: ret._id.toString(), ..._.omit(ret, sanitizableFields) };
    },
    versionKey: false,
  });
};
