import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
	statusCode: number;
	code: string;

	constructor(message: string, statusCode: number, code:string) {
		super(message);
		this.statusCode = statusCode;
		this.code = code
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export const customErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.statusCode && err.message) {
		res.status(err.statusCode).send({ msg: err.message });
	} else {
		next(err);
	}
};

export const postgresErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad Request' });
	} else if (
		err.code === '23503' ||
		err.code === '42703' ||
		err.code === '42601'
	) {
		res.status(404).send({ msg: 'Does Not Found' });
	} else {
		next(err);
	}
};

export const serverErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(500).send({ msg: 'Internal Server Error' });
};
