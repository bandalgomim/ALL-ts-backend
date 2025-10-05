import { PoolOptions } from "mysql2";

export default function getDbConfig(): PoolOptions {
    return {
        host: process.env.MYSQLHOST,
        port: parseInt(process.env.MYSQLPORT as string) || 3306,
        database: process.env.MYSQLDATABASE,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
    };
}