import mongoose from 'mongoose';

import User, { UserBaseDoc } from './user-base';

import type { Model } from 'mongoose';
// -------------------------------------

type AdminDoc = UserBaseDoc;

type AdminModel = Model<AdminDoc>;

const adminSchema = new mongoose.Schema({
  // Define any admin-specific fields if necessary.
});

const Admin = User.discriminator<AdminDoc, AdminModel>('admin', adminSchema);
export default Admin;
