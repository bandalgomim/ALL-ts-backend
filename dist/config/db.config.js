"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDbConfig;
function getDbConfig() {
    return {
        host: process.env.MYSQLHOST || "localhost",
        port: Number(process.env.MYSQLPORT) || 3306,
        database: process.env.MYSQLDATABASE || "ballog",
        user: process.env.MYSQLUSER || "user",
        password: process.env.MYSQLPASSWORD || "password",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}
