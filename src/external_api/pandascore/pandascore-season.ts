/**
 * PandaScore - 시즌 정보 조회
 */

import { createPandaScoreClient } from "../common/http-client";
import { extractNumericId } from "../common/utils";
import { SeasonDto } from "../common/types";
import { PandaScoreLeague, PANDASCORE_COUNTRY_MAP } from "./dto";

/**
 * 리그 ID를 받아 시즌 정보를 SeasonDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore293' 또는 293)
 * @returns SeasonDto 형태의 시즌 정보
 */
export async function pandaScoreSeasonInfo(
    leagueId: string | number
): Promise<SeasonDto | null> {
    const numericId = extractNumericId(leagueId);
    const client = createPandaScoreClient();

    try {
    // 1. 리그 정보 조회
        const leagueData = await client.get<PandaScoreLeague>(`/leagues/${numericId}`, {
            "page[size]": 100
        });

        const leagueName = leagueData.name || "Unknown League";
        const slug = (leagueData.slug || "").toLowerCase();

        // slug에서 국가 코드 추출
        let countryId: string | null = null;
        for (const [ key, code ] of Object.entries(PANDASCORE_COUNTRY_MAP)) {
            if (slug.includes(key)) {
                countryId = code;
                break;
            }
        }

        // 가장 최근 시리즈
        const series = leagueData.series[leagueData.series.length - 1];

        const result: SeasonDto = {
            leagueId: `pandascore${numericId}`,
            leagueName,
            leagueInitial: leagueName,
            leagueLogo: leagueData.image_url || null,
            sportId: 1,
            countryId,
            seasonId: `pandascore${series.id}`,
            seasonName: `${leagueName} ${series.full_name}`,
            seasonStart: series.begin_at || null,
            seasonEnd: series.end_at || null
        };

        return result;

    } catch (error) {
        console.error("API 요청 실패:", error);
        return null;
    }
}
