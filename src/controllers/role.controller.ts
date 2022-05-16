import { Request, Response } from 'express';
import { validateParams } from '../lib/router-handler';
import { Role, RoleInput } from '../models/role.model';

export async function createRole(req: Request) {
  validateParams(req, {
    requiredBodyParams: {fields: ['name', 'description']}});

  const { description, name } = req.body;

  const roleInput: RoleInput = {
    name,
    description,
  };

  return Role.create(roleInput);
};

export function getAllRoles(req: Request) {
  return Role.find().sort('-createdAt').exec();
};

export function getRole(req: Request) {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});

  const { id } = req.params;

  return Role.findOne({ _id: id });
};

export async function updateRole(req: Request) {
  validateParams(req, {
    requiredUrlParams: {fields: ['id']},
    requiredBodyParams: {
      fields: ['name', 'description'], onlyOneRequired: true},
  });

  const { id } = req.params;
  const role = await Role.findOne({ _id: id });
  if (!role) return null;

  for(let k in req.body) {
    role[k] = req.body[k];
  }

  await role.save();
  return role;
};

export function deleteRole(req: Request) {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});
  const { id } = req.params;

  return Role.findByIdAndDelete(id);
};
