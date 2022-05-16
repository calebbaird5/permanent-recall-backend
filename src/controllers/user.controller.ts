import { Request, Response } from 'express';
import { User, UserInput } from '../models/user.model';
import { validateParams } from '../lib/router-handler'

export async function createUser(req: Request) {
  const { firstName, lastName, email, password } = req.body;

  validateParams(req, {
    requiredBodyParams: {
      fields: ['firstName', 'lastName', 'email', 'password']}});

  const userInput: UserInput = {
    firstName,
    lastName,
    email,
    password,
  };

  return User.create(userInput);
};

export function getAllUsers(req: Request) {
  return User.find().sort('-createdAt').exec();
};

export function getUser(req: Request) {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});

  const { id } = req.params;

  return User.findOne({ _id: id });
};

export async function updateUser(req: Request) {
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

  for(let k in req.body) {
    user[k] = req.body[k];
  }

  await user.save();
  return user;
};

export function deleteUser(req: Request) {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});
  const { id } = req.params;

  return User.findByIdAndDelete(id);
};
