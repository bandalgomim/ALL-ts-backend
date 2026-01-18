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
exports.translatorService = void 0;
/* eslint-disable @stylistic/max-len */
const translator_dao_1 = require("../../../models/sync/translator/translator.dao");
const translator_1 = require("../../../utils/translator");
exports.translatorService = {
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const translatedData = [];
        for (const item of data) {
            const tag = yield translator_dao_1.translatorDao.getTag(item.leagueId);
            item.leagueId = tag[0].league_id;
            const homeTag = item.homeTeamId;
            const awayTag = item.awayTeamId;
            if (homeTag === "TBD" || awayTag === "TBD") {
                continue;
            }
            let homeTeamId = homeTag;
            let awayTeamId = awayTag;
            for (const tagItem of tag) {
                if (tagItem.team_name === homeTag || tagItem.team_initial === homeTag || tagItem.tag === homeTag)
                    homeTeamId = tagItem.team_id;
                if (tagItem.team_name === awayTag || tagItem.team_initial === awayTag || tagItem.tag === awayTag)
                    awayTeamId = tagItem.team_id;
                if (homeTeamId !== homeTag && awayTeamId !== awayTag)
                    break;
            }
            item.homeTeamId = homeTeamId;
            item.awayTeamId = awayTeamId;
            item.date = (0, translator_1.parseRelativeDate)(item.date);
            item.matchId = yield translator_dao_1.translatorDao.getMatchId(item);
            console.log("in translatorService | homeTeam: ", homeTag, " | awayTeamId: ", awayTag, item.date ? item.date : "no date");
            console.log("in translatorService | matchId: ", item.matchId ? item.matchId : "⚠️  Team id error", " | homeTeamId: ", homeTag, " | awayTeamId: ", awayTag, item.date ? item.date : "no date", "\n");
            item.type = (0, translator_1.parseRelativeType)(item.type);
            translatedData.push(item);
        }
        const res = yield translator_dao_1.translatorDao.post(translatedData);
        return res;
    })
};
