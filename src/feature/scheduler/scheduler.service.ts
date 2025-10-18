
import { RowDataPacket } from "mysql2";
import redisClient from "../../../config/db.redis";
import { schedulerDao } from "../../models/scheduler/scheduler.dao";
import { postBatchSchedulerReqDto, postSchedulerReqDto } from "../../models/scheduler/scheduler.dto";
import { concatByLeague, findLiveUpdates, makePrevMatchList, matchDataTranslator, setPrevData, supplement, supplementMatchList } from "../../utils/matchData";
import { sentNotifiLive } from "../../utils/fcm/fcm";

export const schedulerService = {
    get: async (date: string) => {

          type Block = { league: string, start: string, end: string }; // ISO 문자열
          const H12 = 12 * 60 * 60 * 1000;
          const toKstIso = (date: string, time: string) => `${date}T${time}.000Z`;
          const toMsKst = (date: string, time: string) => new Date(toKstIso(date, time)).getTime();


          await setPrevData(date);
          const result: RowDataPacket[] = await schedulerDao.get(date);

          const res: Block[] = [];
          let current: Block | null = null;

          for (let i = 0; i < result.length; i++) {
              const row = result[i];
              const tMs = toMsKst(row.match_date, row.match_time);
              const iso = toKstIso(row.match_date, row.match_time);

              // eslint-disable-next-line @stylistic/max-len
              const needNewBlock = !current || row.league_name !== current.league || (tMs - new Date(current.end).getTime()) > H12;

              if (needNewBlock) {
                  if (current) res.push(current);
                  current = { league: row.league_name, start: iso, end: iso };
              } else {
                  if (current) {
                      current.end = iso; // 같은 블록이면 끝 시간만 갱신
                  }
              }
          }

          if (current) res.push(current);

          for (const item of res) {
              const end = new Date(new Date(item.end).getTime() + H12).toISOString();    // '...Z'
              const start = new Date(item.start).toISOString();
              item.end = `${end.split("T")[0]} ${end.split("T")[1].split(".")[0]}`; // 'YYYY-MM-DD HH:MM:SS'
              item.start = `${start.split("T")[0]} ${start.split("T")[1].split(".")[0]}`; // 'YYYY-MM-DD HH:MM:SS'
          }

          return res;
    },
    post: async (data: postSchedulerReqDto, date: string | null) => {
        const prevMatchListRedis = await redisClient.get(`prevMatchList_${date}`) as string;
        let list: postSchedulerReqDto;
        if (!prevMatchListRedis && (date === null)) {
            list = makePrevMatchList();
        } else {
            list = JSON.parse(prevMatchListRedis);
        }

        const league = Object.keys(data);
        const newData: postSchedulerReqDto = {};
        for (const league in data) {
            if (!newData[league]) newData[league] = [];
            const prevItems = list[league] ?? [];
            if (!data[league] || data[league].length === 0) {
                continue;
            } else {
                for (const item of data[league]) {
                    if (item.homeTeamId === "TBD" || item.awayTeamId === "TBD" || item.homeTeamId === "?" || item.awayTeamId === "?") { continue; }
                    if (!prevItems.includes(item)) {
                        // doubleHeader 판정
                        let isDoubleHeader = false;
                        for (const exist of newData[league]) {
                            if (
                                exist.date === item.date
                                && exist.homeTeamId === item.homeTeamId
                                && exist.awayTeamId === item.awayTeamId
                                && exist.time !== item.time
                            ) {
                                isDoubleHeader = true;
                                break;
                            }
                        }
                        if (!isDoubleHeader) {
                            for (const exist of prevItems) {
                                if (
                                    exist.date === item.date
                                    && exist.homeTeamId === item.homeTeamId
                                    && exist.awayTeamId === item.awayTeamId
                                    && exist.time !== item.time
                                ) {
                                    isDoubleHeader = true;
                                    break;
                                }
                            }
                        }
                        item.doubleHeader = isDoubleHeader ? 2 : 1;
                        newData[league].push(item);
                    }
                }
            }
        }
        const insertData = await matchDataTranslator(newData);
        const supplementRes = await supplement(insertData);

        if (supplementRes.status) {
            const res = await schedulerDao.post(insertData);
            if (res && supplementRes.filterdMatch.length > 0) {
                await supplementMatchList(supplementRes.filterdMatch);
            }
        }
        for (const leagueName of league) {
            const live = findLiveUpdates(list[leagueName], data[leagueName]);
            if (live.length !== 0) {
                console.log(`Live updates found for league ${leagueName}:`, live);
                for (const match of live) {
                    await sentNotifiLive(match.matchId as string);
                }
            }
            list[leagueName] = data[leagueName];
        }
        if (date !== null) {
            await redisClient.set(`prevMatchList_${date}`, JSON.stringify(list));
        }
    },
    batch: async (data: postBatchSchedulerReqDto) => {
        if (!await redisClient.get("batch_matchList")) {
            await redisClient.set("batch_matchList", JSON.stringify({}));
        }
        const raw = await redisClient.get("batch_matchList") as string;
        const prevList = JSON.parse(raw) as postSchedulerReqDto;
        const matchList = concatByLeague(prevList, data.matchList) as postSchedulerReqDto;
        if (data.isLast) {
            await redisClient.del("batch_matchList");
            await schedulerService.post(matchList, null);
        } else {
            await redisClient.set("batch_matchList", JSON.stringify(matchList));
        }
    }
};
