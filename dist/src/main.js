"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_pool_1 = require("./../config/db.pool");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
(0, db_pool_1.initPool)();
const app = (0, app_1.default)();
app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000");
});
