import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { COLLECTION } from '../src/constants/db.constants';
import { REQUEST_STATUS } from '../src/db/models/request-info.model/request-info.model';

export class AddExampleRequestsInfo1668623685780 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();

    if (!collections.some((c) => c.name === COLLECTION.REQUEST_INFO))
      await db.createCollection(COLLECTION.REQUEST_INFO);
    const requests = [
      { url: 'https://google.com/', status: REQUEST_STATUS.NEW },
      {
        url: 'https://doc.clickup.com/4664771/p/h/4ebe3-42200/3b6b373d9785962',
        status: REQUEST_STATUS.NEW,
      },
      {
        url: 'https://nodejs.org/',
        status: REQUEST_STATUS.NEW,
      },
      // 404 error page
      {
        url: 'https://www.google.com/masp',
        status: REQUEST_STATUS.NEW,
      },
    ];
    await db.collection(COLLECTION.REQUEST_INFO).insertMany(requests);
  }

  public async down(db: Db): Promise<any> {
    await db.dropCollection(COLLECTION.REQUEST_INFO);
  }
}
