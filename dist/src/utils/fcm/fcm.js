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
exports.sentNotifiLive = exports.sentNotifi = void 0;
const fcm_dao_1 = require("../../models/fcm/fcm.dao");
const sendNotification_1 = require("./sendNotification");
const sentNotifi = (matchId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fcm_dao_1.fcmDao.get(matchId);
    const highlightInfo = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = yield fcm_dao_1.fcmDao.getFcmToken(matchId);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        yield (0, sendNotification_1.sendFCMToManyDevices)(tokens, highlightInfo);
    }
});
exports.sentNotifi = sentNotifi;
const sentNotifiLive = (matchId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sentNotifiLive called with matchId:", matchId); // 디버그용 로그
    if (!matchId)
        return;
    const result = yield fcm_dao_1.fcmDao.get(matchId);
    console.log("FCM DAO result:", result); // 디버그용 로그
    const highlightInfo = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = yield fcm_dao_1.fcmDao.getFcmToken(matchId);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        yield (0, sendNotification_1.sendFCMToManyDevicesLive)(tokens, highlightInfo);
    }
});
exports.sentNotifiLive = sentNotifiLive;
