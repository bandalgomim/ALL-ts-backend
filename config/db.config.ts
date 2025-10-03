import { PoolOptions } from "mysql2";

export default function getDbConfig(): PoolOptions {
    return {
        host: process.env.MYSQLHOST || "localhost",
        port: Number(process.env.MYSQLPORT) || 3306,
        database: process.env.MYSQLDATABASE || "ballog",
        user: process.env.MYSQLUSER || "user",
        password: process.env.MYSQLPASSWORD || "password",
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
    };
}