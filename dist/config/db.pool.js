"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPool = initPool;
exports.getPool = getPool;
const promise_1 = require("mysql2/promise");
const db_config_1 = __importDefault(require("./db.config"));
let pool;
function initPool() {
    if (!pool) {
        pool = (0, promise_1.createPool)((0, db_config_1.default)());
    }
}
function getPool() {
    return pool;
}
