import express from 'express';
import { getDailyCost } from '../Controllers/dailycostcontroller';

const dailyCostRouter = express.Router();

dailyCostRouter.get('/:country', getDailyCost);

export default dailyCostRouter;
