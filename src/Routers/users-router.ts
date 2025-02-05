import express from 'express';
import {
	changeUserInfo,
	deleteUser,
	getAllUsers,
	getSingleUser,
	postUser,
} from '../Controllers/userscontroller';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:user_id', getSingleUser);
usersRouter.delete('/:user_id', deleteUser);
usersRouter.post('/', postUser);
usersRouter.patch('/:user_id', changeUserInfo);

export default usersRouter;
