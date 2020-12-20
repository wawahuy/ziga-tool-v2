import Express from 'express';
import { isProduction } from '../helpers/common';
import routeInject from '../routes/inject';

const expressApp = Express();
expressApp.use('/inject', routeInject);
export default expressApp;