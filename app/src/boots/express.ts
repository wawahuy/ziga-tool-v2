import Express from 'express';
import routerInject from '../routes/inject';
import { isProduction } from '../helpers/common';

const expressApp = Express();
expressApp.use('/inject', routerInject);
export default expressApp;