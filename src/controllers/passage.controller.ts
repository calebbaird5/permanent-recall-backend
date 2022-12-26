import { Request } from 'express';
import { Passage, PassageDocument, PassageInput, PassageReviewList } from '../models/passage.model';
import { badRequest, unauthorized, validateParams } from '../lib/router-handler'
import { isToday, monthBefore, weekBefore, yearBefore } from '../lib/date';
import * as ObjectsToCsv from 'objects-to-csv';

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

export function getPassageUploadFormat(req: Request): Promise<string> {
  let uploadType = 'json';
  if (req.query.uploadType && typeof req.query.uploadType === 'string')
    uploadType = req.query.uploadType;

  let autoFillDates = false;
  if (req.query.autoFillDates === 'true') autoFillDates = true;

  interface DefaultPassage {
    prompt: string;
    reference: string;
    text: string;
    reviewDates?: Date[] | string[];
  }

  let defaultPassage: DefaultPassage = { prompt: '', reference: '', text: '' };
  if (!autoFillDates) {
    defaultPassage.reviewDates = [new Date()];
  }

  switch (uploadType) {
    case 'json':
      return Promise.resolve(JSON.stringify([defaultPassage], null, 2));
    case 'csv':
      const csv = new ObjectsToCsv([defaultPassage]);
      return csv.toString();
    default:
      throw badRequest('Invalid uploadType. Expected either `json` or `csv`');
  }
};

export async function uploadPassages(req: Request)
: Promise<PassageDocument[]> {
  validateParams(req, { requiredBodyParams: { fields: ['passages'] } });
  if (!req.user || !req.user.id) throw unauthorized();
  if (!Array.isArray(req.body.passages))
    throw badRequest('Malformed Request. body.passages should be an array');

  // Determine the date for the first passage
  let numPassages = req.body.passages.length;
  let now = new Date();
  let startDate = new Date(now);
  startDate.setDate(now.getDate() - numPassages);

  // The user can set the start date but we will not accept a value that
  // is to recent to fit all the passages in the past.
  if (req.body.startDate) {
    let providedStartDate = new Date(req.body.startDate);
    if (providedStartDate < startDate) startDate = providedStartDate;
  }
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + numPassages);

  // We will loop through the passage list in reverse so that we can
  // add review dates as we move back in time.
  let passageInput: PassageInput[] = [];
  let reviewDates: Date[] = [];
  let index = 0;
  for (let { prompt, reference, text } of [...req.body.passages].reverse()) {
    if (!prompt || !reference || !text)
      throw badRequest('Malformed body. One or more entries is missing prompt, reference, or text.');

    let reviewDate = new Date();
    reviewDate.setDate(endDate.getDate() - index);
    reviewDates.push(reviewDate)
    passageInput.push({
      prompt,
      reference,
      text,
      user: { id: req.user.id },
      reviewDates: [...reviewDates],
      latestReviewDate: reviewDate,
    })
    ++index;
  }

  return await Promise.all(passageInput.map(el => Passage.create(el)));
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
