import { Request, Response, NextFunction } from 'express';
import {
	addUser,
	fetchAllUsers,
	fetchSingleUser,
	removeUser,
	updateUser,
} from '../Models/usersmodel';
import { checkExist } from '../Models/api.utils';
import { Users } from '../types/types';

export const getAllUsers = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	fetchAllUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};

export const getSingleUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: string = req.params.user_id;
	const promises: Promise<Users | void>[] = [fetchSingleUser(user_id)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	Promise.all(promises)
		.then(([user]) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
	const user_id: string = req.params.user_id;
	const promises: Promise<number | void | null>[] = [removeUser(user_id)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}
	Promise.all(promises)
		.then(([removedRow]) => {
			res.status(204).send({ removedRow });
		})
		.catch((err) => {
			next(err);
		});
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
	const postBody = req.body;

	addUser(postBody)
		.then((user) => {
			res.status(201).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

export const changeUserInfo = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const postBody = req.body;
	const user_id: string = req.params.user_id;

	const promises: Promise<Users | void>[] = [updateUser(user_id, postBody)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	Promise.all(promises)
		.then(([user]) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};
