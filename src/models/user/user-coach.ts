import mongoose from 'mongoose';

import User from './user-base';

import type { Types, Model } from 'mongoose';
import type { UserBaseDoc } from './user-base';

// -------------------------------------

interface CoachDoc extends UserBaseDoc {
  clients: Types.ObjectId[];
  experience: number;
  speciality: string[];
}

type CoachModel = Model<CoachDoc>;

const coachSchema = new mongoose.Schema({
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  experience: {
    type: Number,
    required: true,
  },
  speciality: {
    type: [],
    validate: {
      validator: (specialityArray: string[]) => specialityArray.length <= 2,
      message: 'Coach can have at most 2 specialities',
    },
  },
});

const Coach = User.discriminator<CoachDoc, CoachModel>('coach', coachSchema);
export default Coach;
