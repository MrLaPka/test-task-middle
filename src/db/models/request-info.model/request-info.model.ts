import { ObjectId } from 'mongodb';
import { model, Schema } from 'mongoose';
import { COLLECTION, MODEL } from '../../../constants/db.constants';
import { schemaBase } from '../../constants';

export enum REQUEST_STATUS {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface IRequsetInfo {
  _id: ObjectId;
  url: string;
  status: REQUEST_STATUS;
  data?: string;
  http_code?: number;
}

const RequsetInfoSchema = new Schema<IRequsetInfo>(
  {
    url: { type: String, required: true },
    status: { type: String, enum: Object.values(REQUEST_STATUS), required: true },
    data: String,
    http_code: Number,
  },
  { ...schemaBase },
);

export const RequestInfo = model<IRequsetInfo>(
  MODEL.REQUEST_INFO,
  RequsetInfoSchema,
  COLLECTION.REQUEST_INFO,
);
