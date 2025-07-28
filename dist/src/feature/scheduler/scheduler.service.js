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
exports.schedulerService = void 0;
const scheduler_dao_1 = require("../../models/scheduler/scheduler.dao");
exports.schedulerService = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield scheduler_dao_1.schedulerDao.get(date);
        const res = [];
        const scheduler = {
            league: "",
            start: "",
            end: ""
        };
        result.forEach((data, index) => {
            if (index === 0 || data.league_name !== result[index - 1].league_name) {
                scheduler.league = data.league_name;
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
                // eslint-disable-next-line @stylistic/max-len
            }
            else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 3 * 60 * 60 * 1000) {
                // 객체를 복사하여 추가
                res.push(Object.assign({}, scheduler));
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            }
            else {
                scheduler.end = data.match_date;
            }
            if (index === result.length - 1) {
                // 마지막 요소도 객체 복사하여 추가
                res.push(Object.assign({}, scheduler));
            }
        });
        return res;
    })
};
