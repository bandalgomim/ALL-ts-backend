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
const getMatchId_dao_1 = require("../../../models/matchData/getMatchId/getMatchId.dao");
const getTag_dao_1 = require("../../../models/matchData/getTag/getTag.dao");
const translator_dao_1 = require("../../../models/matchData/translator/translator.dao");
const translator_1 = require("../../../utils/translator");
exports.translatorService = {
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const teamTag = yield getTag_dao_1.getTagDao.getTeamTag();
        const leagueTag = yield getTag_dao_1.getTagDao.getLeagueTag();
        const platformTag = yield getTag_dao_1.getTagDao.getPlatformTag();
        const translatedData = [];
        for (const item of data) {
            // leagueTag의 league_tag와 item.leagueId를 비교해야 함
            item.leagueId = ((_a = leagueTag.find((tag) => tag.league_tag === item.leagueId)) === null || _a === void 0 ? void 0 : _a.league_id) || item.leagueId;
            // eslint-disable-next-line @stylistic/max-len
            item.platformId = ((_b = platformTag.find((tag) => tag.platform_tag === item.platformId)) === null || _b === void 0 ? void 0 : _b.platform_id) || item.platformId;
            console.log("in translatorService | homeTeamId: ", item.homeTeamId, " | awayTeamId: ", item.awayTeamId, item.date ? item.date : "no date");
            const homeTag = item.homeTeamId;
            const awayTag = item.awayTeamId;
            if (homeTag === "TBD" || awayTag === "TBD") {
                continue;
            }
            let homeTeamId = homeTag;
            let awayTeamId = awayTag;
            for (const tag of teamTag) {
                if (tag.league_id === item.leagueId) {
                    if (tag.team_tag === homeTag)
                        homeTeamId = tag.team_id;
                    if (tag.team_tag === awayTag)
                        awayTeamId = tag.team_id;
                    if (homeTeamId !== homeTag && awayTeamId !== awayTag)
                        break;
                }
            }
            item.homeTeamId = homeTeamId;
            item.awayTeamId = awayTeamId;
            item.date = (0, translator_1.parseRelativeDate)(item.date);
            item.matchId = yield getMatchId_dao_1.getMatchIdDao.get(item.date, item.homeTeamId, item.awayTeamId, item.doubleHeader);
            console.log("in translatorService | matchId: ", item.matchId ? item.matchId : "⚠️  Team id error", " | homeTeamId: ", item.homeTeamId, " | awayTeamId: ", item.awayTeamId, item.date ? item.date : "no date", "\n");
            item.type = (0, translator_1.parseRelativeType)(item.type);
            translatedData.push(item);
        }
        yield translator_dao_1.translatorDao.post(translatedData);
        // prevUriList를 저장하거나 반환 등 필요한 작업 수행
    })
};
