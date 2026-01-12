import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pgclient = new pg.Client(process.env.DATABASE_URL);//create a new object or type pg client to open connection betwen server and database

pgclient.on("error", (err) => console.error("Unexpected error on idle client", err));


export default pgclient;    