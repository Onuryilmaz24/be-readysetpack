import { Request, Response, NextFunction } from 'express';
import { checkExist } from '../Models/api.utils';
import { Trips } from '../types/types';
import {
	changeTripData,
	createTrip,
	deleteSingleTrip,
	fetchSingleTrip,
	fetchTripsByUserId,
} from '../Models/tripsmodels';

export const getTripsByUserId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: string = req.params.user_id;
	const promises: Promise<Trips[] | void>[] = [fetchTripsByUserId(user_id)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	Promise.all(promises)
		.then(([trips]) => {
			res.status(200).send({ trips });
		})
		.catch((err) => {
			next(err);
		});
};

export const addTrip = (req: Request, res: Response, next: NextFunction) => {
	const user_id: string = req.params.user_id;
	const postBody: Trips = req.body;
	const promises: Promise<Trips[] | void>[] = [createTrip(user_id, postBody)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}
	Promise.all(promises)
		.then(([trip]) => {
			res.status(201).send({ trip });
		})
		.catch((err) => {
			next(err);
		});
};

export const updateTripData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: string = req.params.user_id;
	const trip_id: string = req.params.trip_id;
	const postBody: Trips = req.body;
	const promises: Promise<Trips[] | void>[] = [
		changeTripData(user_id, trip_id, postBody),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([trip]) => {
			res.status(200).send({ trip });
		})
		.catch((err) => {
			next(err);
		});
};

export const getSingleTrip = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: string = req.params.user_id;
	const trip_id: string = req.params.trip_id;
	const promises: Promise<Trips[] | void>[] = [
		fetchSingleTrip(user_id, trip_id),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}
	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([trip]) => {
			res.status(200).send({ trip });
		})
		.catch((err) => {
			next(err);
		});
};

export const removeSingleTrip = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: string = req.params.user_id;
	const trip_id: string = req.params.trip_id;
	const promises: Promise<number | void | null>[] = [
		deleteSingleTrip(user_id, trip_id),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([removedRow]) => {
			res.status(204).send({ removedRow });
		})
		.catch((err) => {
			next(err);
		});
};
