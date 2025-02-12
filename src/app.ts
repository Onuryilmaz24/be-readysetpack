import express from 'express';
import cors from 'cors';
import apiRouter from './Routers/api-router';
import {
	customErrorHandler,
	postgresErrorHandler,
	serverErrorHandler,
} from './error';
const app = express();

app.use(express.json(), cors());

app.use('/api', apiRouter);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

export default app;
