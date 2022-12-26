import { Request } from 'express';
import { Setting, SettingDocument, SettingInput } from '../models/setting.model';
import { unauthorized, validateParams } from '../lib/router-handler'

export async function createSetting(req: Request): Promise<SettingDocument> {
  if (!req.user) throw unauthorized();

  validateParams(req, {
    requiredBodyParams: { fields: ['name', 'value'] },
  });

  const { name, value } = req.body;

  const settingInput: SettingInput = {
    name,
    value,
    user: { id: req.user.id },
  };

  return await Setting.create(settingInput);
};

export function getAllSettings(req: Request): Promise<SettingDocument[]> {
  if (!req.user) throw unauthorized();
  return Setting.find({'user.id': req.user?.id}).sort('-createdAt').exec();
};

export async function getSetting(req: Request): Promise<SettingDocument> {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});

  const { id } = req.params;

  return await Setting.findOne(
    { _id: id, 'user.id': req.user?.id }) as SettingDocument;
};

export async function updateSetting(req: Request): Promise<SettingDocument> {
  validateParams(req, {
    requiredUrlParams: {fields: ['id']},
    requiredBodyParams: {
      fields: ['name', 'value'],
      onlyOneRequired: true
    },
  });

  const { id } = req.params;

  const setting = await Setting.findOne(
    { _id: id, 'user.id': req.user?.id });
  if (!setting) return null;

  for(let k in req.body) setting[k] = req.body[k];

  await setting.save();
  return setting;
};

export async function deleteSetting(req: Request): Promise<SettingDocument> {
  validateParams(req, { requiredUrlParams: { fields: ['id'] } });
  const { id } = req.params;
  return await Setting.findOneAndDelete(
    { _id: id, 'user.id': req.user?.id }) as SettingDocument;
};
