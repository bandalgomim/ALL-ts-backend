import redisClient from "config/db.redis";
import { createApiFootballClient, ApiResponse } from "../common";
import { ApiFootballTeam } from "./dto";

export async function getCurrentRound(
    leagueId: number,
    season: number,
    client: ReturnType<typeof createApiFootballClient>
): Promise<string | null> {
    const key = `init:round:${leagueId}:${season}`;

    const cached = await redisClient.get(key);
    if (cached) return cached;

    try {
    // 1) current=true 먼저
        const currentRes = await client.get<ApiResponse<string[]>>("/fixtures/rounds", {
            league: leagueId,
            season,
            current: "true"
        });

        let rounds = currentRes.response ?? [];

        // 2) 없으면 전체 라운드에서 "마지막" 선택(주석대로라면)
        if (!rounds.length) {
            const allRes = await client.get<ApiResponse<string[]>>("/fixtures/rounds", {
                league: leagueId,
                season
            });
            rounds = allRes.response ?? [];
            if (rounds.length) rounds = [ rounds[rounds.length - 1] ]; // 마지막 라운드
        }

        const round = rounds[0] ?? null;
        if (round) {
            await redisClient.set(key, round, { EX: 24 * 60 * 60 });
        }
        return round;
    } catch {
        return null;
    }
}

export async function getTeamInfos(
    leagueId: number,
    seasonId: number,
    client: ReturnType<typeof createApiFootballClient>
) {
    const key = `init:teams:${leagueId}:${seasonId}`;
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);
    const teamsData = await client.get<ApiResponse<ApiFootballTeam[]>>("/teams", {
        league: leagueId,
        season: seasonId
    });
    if (teamsData.response) {
        await redisClient.set(key, JSON.stringify(teamsData.response), { EX: 24 * 60 * 60 });
        return teamsData.response;
    }
    return null;
}
