"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerController = void 0;
const scheduler_service_1 = require("./scheduler.service");
exports.schedulerController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const date = req.query.date;
        const result = yield scheduler_service_1.schedulerService.get(date);
        res.json(result);
    }),
    post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const date = req.query.date;
        const data = req.body;
        yield scheduler_service_1.schedulerService.post(data, date);
        res.status(201).end();
    })
};
