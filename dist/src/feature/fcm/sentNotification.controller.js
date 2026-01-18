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
exports.sentNotificationLive = exports.sentNotification = void 0;
const fcm_dao_1 = require("../../models/fcm/fcm.dao");
const sentNotification_service_1 = require("../fcm/sentNotification.service");
const sentNotification = (matchId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fcm_dao_1.fcmDao.get(matchId);
    console.log(result);
    const highlightInfo = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = yield fcm_dao_1.fcmDao.getFcmToken(matchId);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        console.log("Sending FCM notifications to tokens:", tokens);
        yield (0, sentNotification_service_1.sendFCMToManyDevices)(tokens, highlightInfo);
    }
});
exports.sentNotification = sentNotification;
const sentNotificationLive = (matchId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!matchId)
        return;
    const result = yield fcm_dao_1.fcmDao.getLive(matchId);
    console.log("Live match info result:", result[0].home_team_name, result[0].away_team_name);
    if (!result[0])
        return;
    const highlightInfo = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = yield fcm_dao_1.fcmDao.getFcmToken(matchId);
    console.log("Live match FCM tokens:", tokens);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        yield fcm_dao_1.fcmDao.postLiveAlarm(matchId);
        yield (0, sentNotification_service_1.sendFCMToManyDevicesLive)(tokens, highlightInfo);
    }
});
exports.sentNotificationLive = sentNotificationLive;
