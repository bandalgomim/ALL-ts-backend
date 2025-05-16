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
exports.getLocalDateString = exports.chackDailyMatch = void 0;
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
const fcm_dao_1 = require("../../models/fcm/fcm.dao");
const sendNotification_1 = require("./sendNotification");
const chackDailyMatch = () => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield db_redis_1.default.get("matchList");
    const today = (0, exports.getLocalDateString)();
    const result = yield fcm_dao_1.fcmDao.chackDailyMatch(today);
    if (list === null) {
        yield db_redis_1.default.set("matchList", JSON.stringify([]));
    }
    else if (Array.isArray(result) && result.length === 0) {
        yield db_redis_1.default.set("matchList", JSON.stringify(result));
    }
    else {
        const parsedList = JSON.parse(list);
        const new_match = [];
        for (const resultMatch of result) {
            const exists = parsedList.some((listMatch) => listMatch.match_id === resultMatch.match_id);
            if (!exists) {
                new_match.push(resultMatch);
            }
        }
        const updatedList = parsedList.filter((listMatch) => result.some((resultMatch) => resultMatch.match_id === listMatch.match_id));
        for (const newItem of new_match) {
            let tokens = yield fcm_dao_1.fcmDao.getFcmToken(newItem.match_id);
            // 중복 제거
            tokens = Array.from(new Set(tokens));
            if (tokens.length !== 0) {
                yield (0, sendNotification_1.sendFCMToManyDevices)(tokens, newItem);
            }
        }
        yield db_redis_1.default.set("matchList", JSON.stringify([...updatedList, ...new_match]));
    }
});
exports.chackDailyMatch = chackDailyMatch;
const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
exports.getLocalDateString = getLocalDateString;
