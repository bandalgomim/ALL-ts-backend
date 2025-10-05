"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDbConfig;
function getDbConfig() {
    return {
        host: process.env.MYSQLHOST,
        port: parseInt(process.env.MYSQLPORT) || 3306,
        database: process.env.MYSQLDATABASE,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
    };
}
