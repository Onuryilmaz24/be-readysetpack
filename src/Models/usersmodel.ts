import db from "../db/connection";
import { Users } from "../types/types";

export const fetchAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

export const fetchSingleUser = (user_id: string) => {
  const sqlText: string = `SELECT * FROM users WHERE user_id = $1`;
  const values: string[] = [user_id];

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

export const removeUser = (user_id: string) => {
  const sqlText: string = `DELETE FROM users WHERE user_id = $1`;
  const values = [user_id];

  return db.query(sqlText, values).then(({ rowCount }) => {
    return rowCount;
  });
};

export const addUser = (postBody: Users) => {
  const { user_id, username, name } = postBody;

  const validColumns = ["user_id", "username", "name"];
  if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
    return Promise.reject({ statusCode: 400, message: "Bad Request" });
  }

  const nameRegex = /\d/i;

  if (nameRegex.test(name)) {
    return Promise.reject({ statusCode: 400, message: "Bad Request" });
  }

  if (!user_id) {
    let sqlInsertQuery: string = `INSERT INTO users (username, name)
	VALUES ($1, $2) RETURNING *;`;
    const values = [username, name];

    return db.query(sqlInsertQuery, values).then(({ rows }) => {
      return rows[0];
    });
  } else {

	let sqlInsertQuery: string = `INSERT INTO users (user_id,username, name)
	VALUES ($1, $2,$3) RETURNING *;`;
    const values = [user_id,username, name];

    return db.query(sqlInsertQuery, values).then(({ rows }) => {
      return rows[0];
    });
  }
};

export const updateUser = (user_id: string, postBody: Users) => {
  const { name } = postBody;
  const values = Object.values(postBody);
  const updateFields = Object.keys(postBody);

  const validColumns = ["username", "name"];
  if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
    return Promise.reject({ statusCode: 400, message: "Bad Request" });
  }

  const nameRegex = /\d/i;

  if (nameRegex.test(name)) {
    return Promise.reject({ statusCode: 400, message: "Bad Request" });
  }

  const setClause = updateFields
    .map((field, index) => {
      return `${field} = $${index + 1}`;
    })
    .join(`, `);

  values.push(user_id);

  const updateQuery: string = `
    UPDATE users
    SET ${setClause}
    WHERE user_id = $${values.length}
    RETURNING *;
  `;

  return db.query(updateQuery, values).then(({ rows }) => {
    return rows[0];
  });
};
