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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerService = void 0;
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
const scheduler_dao_1 = require("../../models/scheduler/scheduler.dao");
const matchData_1 = require("../../utils/matchData");
exports.schedulerService = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, matchData_1.setPrevData)(date);
        const result = yield scheduler_dao_1.schedulerDao.get(date);
        const res = [];
        const scheduler = { league: "", start: "", end: "" };
        result.forEach((data, index) => {
            if (index === 0 || data.league_name !== result[index - 1].league_name) {
                if (index !== 0) {
                    res.push(Object.assign({}, scheduler));
                }
                scheduler.league = data.league_name;
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
                // eslint-disable-next-line @stylistic/max-len
            }
            else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 5 * 60 * 60 * 1000) {
                res.push(Object.assign({}, scheduler));
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            }
            else {
                scheduler.end = data.match_date;
            }
            if (index === result.length - 1) {
                res.push(Object.assign({}, scheduler));
            }
        });
        for (const item of res) {
            if (item === null || item === void 0 ? void 0 : item.end) {
                const end = new Date(item.end);
                if (!isNaN(end.getTime())) {
                    // eslint-disable-next-line @stylistic/no-mixed-operators
                    item.end = new Date(end.getTime() + 5 * 60 * 60 * 1000).toISOString();
                }
            }
        }
        return res;
    }),
    post: (data, date) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, date);
        const prevMatchList = yield db_redis_1.default.get(`prevMatchList_${date}`);
        let insertData = [];
        if (!prevMatchList) {
            insertData = yield (0, matchData_1.matchDataTranslator)(data);
        }
        else {
            const list = JSON.parse(prevMatchList);
            const newData = {};
            for (const league in data) {
                if (!newData[league])
                    newData[league] = [];
                for (const item of data[league]) {
                    if (!list[league].includes(item)) {
                        newData[league].push(item);
                    }
                }
            }
            insertData = yield (0, matchData_1.matchDataTranslator)(newData);
        }
        yield scheduler_dao_1.schedulerDao.post(insertData);
        yield db_redis_1.default.set(`prevMatchList_${date}`, JSON.stringify(data));
    })
};
