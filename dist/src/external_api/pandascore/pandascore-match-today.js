"use strict";
/**
 * PandaScore - 오늘 경기 정보 조회
 */
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
exports.pandaScoreMatchToday = pandaScoreMatchToday;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
/**
 * PandaScore 상태를 MatchStatus로 변환
 */
function convertPandaScoreStatus(status) {
    switch (status) {
        case "finished":
            return "end";
        case "running":
            return "live";
        case "not_started":
            return "next";
        default:
            return "off";
    }
}
/**
 * 리그 ID, 시리즈 ID, 날짜를 받아 해당 날짜와 하루 전, 하루 후 경기 정보를 MatchDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore294' 또는 294)
 * @param seriesId - 시리즈 ID (필수)
 * @param date - 조회할 날짜 (예: '2025-01-15' 또는 Date 객체)
 * @returns MatchDto 형태의 경기 정보 리스트 (date-1, date, date+1의 3일간)
 */
function pandaScoreMatchToday(leagueId, seriesId, date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const numericLeagueId = (0, utils_1.extractNumericId)(leagueId);
        if (!seriesId) {
            throw new Error("seriesId is required");
        }
        const numericSeriesId = (0, utils_1.extractNumericId)(seriesId);
        if (!date) {
            throw new Error("date is required");
        }
        const targetDate = (0, utils_1.parseDate)(date);
        // 날짜 범위 계산: date-1부터 date+1까지
        const dateFrom = (0, utils_1.addDays)(targetDate, -1);
        dateFrom.setHours(0, 0, 0, 0);
        const dateTo = (0, utils_1.addDays)(targetDate, 1);
        dateTo.setHours(23, 59, 59, 0);
        const dateFromStr = dateFrom.toISOString().replace(".000Z", "Z");
        const dateToStr = dateTo.toISOString().replace(".000Z", "Z");
        const client = (0, http_client_1.createPandaScoreClient)();
        try {
            // 1. 시리즈 정보 직접 조회
            // 2. 날짜 범위의 경기 조회
            const allMatches = [];
            let page = 1;
            while (true) {
                const matches = yield client.get("/matches", {
                    "filter[serie_id]": numericSeriesId,
                    "range[begin_at]": `${dateFromStr},${dateToStr}`,
                    "page[size]": 100,
                    "page[number]": page,
                    sort: "begin_at"
                });
                if (!matches || matches.length === 0)
                    break;
                for (const match of matches) {
                    const dateTime = (0, utils_1.formatDateTime)(match.scheduled_at || "");
                    // 상대팀 정보 추출
                    const opponents = match.opponents || [];
                    const homeTeamId = ((_b = (_a = opponents[0]) === null || _a === void 0 ? void 0 : _a.opponent) === null || _b === void 0 ? void 0 : _b.id)
                        ? `pandascore${opponents[0].opponent.id}`
                        : "";
                    const awayTeamId = ((_d = (_c = opponents[1]) === null || _c === void 0 ? void 0 : _c.opponent) === null || _d === void 0 ? void 0 : _d.id)
                        ? `pandascore${opponents[1].opponent.id}`
                        : "";
                    // 스코어 추출
                    const results = match.results || [];
                    const homeTeamScore = ((_e = results[0]) === null || _e === void 0 ? void 0 : _e.score) || 0;
                    const awayTeamScore = ((_f = results[1]) === null || _f === void 0 ? void 0 : _f.score) || 0;
                    const status = convertPandaScoreStatus(match.status);
                    const matchInfo = {
                        date: dateTime,
                        status,
                        homeTeamId,
                        awayTeamId,
                        homeTeamScore,
                        awayTeamScore,
                        leagueId: `pandascore${numericLeagueId}`,
                        doubleHeader: 0,
                        matchId: match.id ? `pandascore${match.id}` : "",
                        seasonId: `pandascore${numericSeriesId}`
                    };
                    allMatches.push(matchInfo);
                }
                if (matches.length < 100)
                    break;
                page++;
            }
            return allMatches;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            console.error("API 요청 실패: pandascore-match-today");
            return null;
        }
    });
}
