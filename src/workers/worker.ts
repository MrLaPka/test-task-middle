import { parentPort, workerData } from 'worker_threads';
import axios from 'axios';
import { REQUEST_STATUS } from '../db/models/request-info.model/request-info.model';

const getRequest = async (): Promise<void> => {
  try {
    const { data, status } = await axios.get(workerData.url);
    const insertStatus = status === 200 ? REQUEST_STATUS.DONE : REQUEST_STATUS.ERROR;
    parentPort?.postMessage({ id: workerData.id, data, status, insertStatus });
  } catch (err: any) {
    console.info('Worker Error: ', err.message);
    if (err.response) {
      parentPort?.postMessage({
        id: workerData.id,
        data: err.response.data,
        status: err.response.status,
        insertStatus: REQUEST_STATUS.ERROR,
      });
    } else {
      parentPort?.postMessage({
        id: workerData.id,
        data: '',
        status: 404,
        insertStatus: REQUEST_STATUS.ERROR,
      });
    }
  }
};

getRequest().catch((err) => console.error(err));
