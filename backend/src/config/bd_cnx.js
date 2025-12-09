import dotenv from 'dotenv';
import mysql from 'mysql2/promise';


dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default connection;