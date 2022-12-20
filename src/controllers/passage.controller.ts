import { Request } from 'express';
import { Passage, PassageDocument, PassageInput, PassageReviewList } from '../models/passage.model';
import { validateParams } from '../lib/router-handler'
import { isToday, monthBefore, weekBefore, yearBefore } from '../lib/date';

export async function createPassage(req: Request): Promise<PassageDocument> {
  const { prompt, reference, text } = req.body;

  validateParams(req, {
    requiredBodyParams: { fields: ['prompt', 'reference', 'text'] },
  });

  const passageInput: PassageInput = {
    prompt,
    reference,
    text,
    reviewDates: [],
    user: {
      id: req.user?.id
    }
  };

  return await Passage.create(passageInput);
};

export function getAllPassages(req: Request): Promise<PassageDocument[]> {
  return Passage.find({'user.id': req.user?.id}).sort('-createdAt').exec();
};

export async function getPassage(req: Request): Promise<PassageDocument> {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});

  const { id } = req.params;

  return await Passage.findOne(
    { _id: id, 'user.id': req.user?.id }) as PassageDocument;
};

export async function getPassageReviewList(req: Request)
  : Promise<PassageReviewList> {
  let passages = await Passage.find({ 'user.id': req.user?.id })
    .sort('-createdAt').exec() as PassageDocument[];
  let daily = passages.filter(el =>
    !el.reviewDates.length || (
      el.reviewDates.length < 7
      && !isToday(el.latestReviewDate)
    ));

  let weekly = passages.filter(el =>
    el.latestReviewDate
    && el.reviewDates.length >= 7
    && el.reviewDates.length < 11
    && el.latestReviewDate < weekBefore()
  );

  let monthly = passages.filter(el =>
    el.latestReviewDate
    && el.reviewDates.length >= 11
    && el.reviewDates.length < 23
    && el.latestReviewDate < monthBefore()
  );

  let yearly = passages.filter(el =>
    el.latestReviewDate
    && el.reviewDates.length >= 23
    && el.latestReviewDate < yearBefore()
  );

  return {
    daily,
    weekly,
    monthly,
    yearly,
    all: [].concat(daily, weekly, monthly, yearly),
  }
};

export async function updatePassage(req: Request): Promise<PassageDocument> {
  validateParams(req, {
    requiredUrlParams: {fields: ['id']},
    requiredBodyParams: {
      fields: [
        'prompt',
        'reference',
        'text',
        'reviewDates',
      ],
      onlyOneRequired: true
    },
  });

  const { id } = req.params;
  const passage = await Passage.findOne(
    {_id: id, 'user.id': req.user?.id });
  if (!passage) return null;

  for(let k in req.body)
    passage[k] = req.body[k];

  await passage.save();
  return passage;
};

export async function reviewPassage(req: Request): Promise<PassageDocument> {
  validateParams(req, {
    requiredUrlParams: { fields: ['id'] },
  });

  const { id } = req.params;
  const passage = await Passage.findOne({ _id: id });
  if (!passage) return null;

  let now = new Date();
  passage.reviewDates.push(now);
  passage.latestReviewDate = now;

  await passage.save();
  return passage;
};

export async function deletePassage(req: Request): Promise<PassageDocument> {
  validateParams(req, {requiredUrlParams: {fields: ['id']}});
  const { id } = req.params;

  return await Passage.findOneAndDelete(
    { _id: id, 'user.id': req.user?.id }) as PassageDocument;
};
