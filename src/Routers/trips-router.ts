import express from 'express';
import {
	addTrip,
	getSingleTrip,
	getTripsByUserId,
	removeSingleTrip,
	updateTripData,
} from '../Controllers/tripscontroller';

const tripsRouter = express.Router();

tripsRouter.get('/:user_id', getTripsByUserId);
tripsRouter.post('/:user_id', addTrip);
tripsRouter.patch('/:user_id/:trip_id', updateTripData);
tripsRouter.get('/:user_id/:trip_id', getSingleTrip);
tripsRouter.delete('/:user_id/:trip_id', removeSingleTrip);

export default tripsRouter;
