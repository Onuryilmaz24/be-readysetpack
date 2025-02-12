import format from "pg-format";
import db from "../db/connection";

export const checkExist = async(table:string,column:string,value:any) =>{
    const queryStr = format("SELECT * FROM %I WHERE %I = $1",table,column);
    const dbOutput = await db.query(queryStr,[value]);

    if(dbOutput.rows.length === 0 ){
        return Promise.reject({statusCode: 404, message: "Does Not Found"})
    }
}