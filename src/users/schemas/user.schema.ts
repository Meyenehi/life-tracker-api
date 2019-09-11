import * as _ from 'lodash';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    salt: String,
    hash: String,
  },
  { timestamps: true },
);

const sanitizableFields = ['_id', 'salt', 'hash'];

UserSchema.methods.sanitize = function() {
  return this.toObject({
    transform: (doc, ret, options) => {
      return { id: ret._id.toString(), ..._.omit(ret, sanitizableFields) };
    },
    versionKey: false,
  });
};
