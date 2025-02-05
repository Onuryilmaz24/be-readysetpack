import usersData from '../data/test-data/users';
import tripsData from '../data/test-data/trips';
import checklistData from '../data/test-data/checklist';
import costsData from '../data/test-data/dailycost';
import seed from './seed';
import db from '../connection';

const runSeed = () => {
	 return seed({ usersData, tripsData, checklistData, costsData }).then(() =>
	 	 db.end()
	 );
};

runSeed();
