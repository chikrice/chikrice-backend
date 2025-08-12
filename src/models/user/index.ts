import User from './user-client';
import Coach from './user-coach';
import Admin from './user-admin';
import BaseUser from './user-base';

const roleModelMap = {
  user: User,
  coach: Coach,
  admin: Admin,
} as const;

export { BaseUser, User, Coach, Admin, roleModelMap };
