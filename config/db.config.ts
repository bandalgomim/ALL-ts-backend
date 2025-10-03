import { PoolOptions } from "mysql2";

export default function getDbConfig(): PoolOptions {
    return {
        host: "175.198.57.200",
        port: 3306,
        database: "railway",
        user: "root",
        password: "qksekfrha1!",
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
    };
}