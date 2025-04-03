"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDbConfig;
function getDbConfig() {
    return {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_DATABASE || "ballog",
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASSWORD || "password",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}
