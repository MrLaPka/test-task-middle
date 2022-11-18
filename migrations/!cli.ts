import 'dotenv/config';
import { mongoMigrateCli } from 'mongo-migrate-ts';

const url = process.env.DB_URL as string;
console.log(`URL: ${url}`);

mongoMigrateCli({
  uri: url,
  migrationsDir: __dirname,
});
