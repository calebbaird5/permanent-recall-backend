import { Request, Response } from 'express';
import { User, UserDocument, UserInput } from '../models/user.model';
import { badRequest, validateParams } from '../lib/router-handler'
import { signToken } from './auth.controller'
import * as bcrypt from 'bcryptjs'
import { SignedToken } from '../models/auth.model';

export async function createUser(req: Request, res: Response)
: Promise<SignedToken> {
  const { firstName, lastName, email, password } = req.body;

  validateParams(req, {
    requiredBodyParams: {
      fields: ['firstName', 'lastName', 'email', 'password']}});

  if (password.length <= 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password))
    throw badRequest('Password must have at least 8 characters and contain 1 UPPER case letter (A-Z), 1 lowercase letter, 1 special character !@#$%^&*, 1 number 0 - 9');

  let passwordHash = await bcrypt.hash(password, 10);

  const userInput: UserInput = {
    firstName,
    lastName,
    email,
    password: passwordHash,
  };

  let user = await User.create(userInput);

  return {
    ...signToken({id: user.id, email}, res),
    user,
  }
};

export async function getAllUsers(): Promise<UserDocument[]> {
  return await User.find().sort('-createdAt').exec() as UserDocument[];
};

export async function getUser(req: Request): Promise<UserDocument> {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});

  const { id } = req.params;

  return await User.findOne({ _id: id }) as UserDocument;
};

export async function updateUser(req: Request): Promise<UserDocument> {
  validateParams(req, {
    requiredUrlParams: {fields: ['id']},
    requiredBodyParams: {
      fields: ['firstName', 'lastName', 'email', 'password'],
      onlyOneRequired: true
    },
  });

  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) return null;

  for(let k in req.body)
    user[k] = req.body[k];

  return await user.save();
};

export async function deleteUser(req: Request): Promise<UserDocument> {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});
  const { id } = req.params;

  return await User.findByIdAndDelete(id) as UserDocument;
};
