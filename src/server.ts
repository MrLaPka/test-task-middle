import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { Worker } from 'worker_threads';
import { ObjectId } from 'mongodb';
import { connectToDb } from './db/db-connect';
import { RequestInfo, REQUEST_STATUS } from './db/models/request-info.model/request-info.model';
import { IInsertData } from './interfaces/IInserData';

const app = express();
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const requestsInfo = await RequestInfo.find({}).lean();
    await Promise.all(
      requestsInfo.map(async (rI) => {
        await RequestInfo.updateOne(
          { _id: rI._id },
          { $set: { status: REQUEST_STATUS.PROCESSING } },
        );
        const worker = new Worker('./src/workers/worker.ts', {
          workerData: { id: rI._id.toString(), url: rI.url },
        });
        worker.on('message', async (insertData: IInsertData) => {
          console.info(
            `Request info for id ${insertData.id}: code: ${insertData.status}, status: ${insertData.insertStatus}`,
          );
          await RequestInfo.updateOne(
            { _id: new ObjectId(insertData.id) },
            {
              $set: {
                http_code: insertData.status,
                status: insertData.insertStatus,
                data: `${insertData.data}`,
              },
            },
          );
        });
        worker.on('error', (err) => {
          console.info(`Error: ${err}`);
        });
      }),
    );
    res.send('Queued');
  }),
);

const port = process.env.SERVER_PORT || 3001;

Promise.all([
  connectToDb(process.env.DB_URL as string, async () => {
    app.listen(port, () => {
      const serverStartedMessage = `Server listening on port ${port}!`;
      console.info(serverStartedMessage);
    });
  }),
]);
