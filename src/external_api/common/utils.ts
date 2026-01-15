/**
 * 공통 유틸리티 함수
 */

/**
 * ID 문자열에서 숫자만 추출
 * @param id - 예: 'apifootball39', 'pandascore293', 39
 * @returns 추출된 숫자
 */
export function extractNumericId(id: string | number): number {
    if (typeof id === "number") {
        return id;
    }

    const match = id.match(/\d+/);
    if (match) {
        return parseInt(match[0], 10);
    }

    throw new Error(`Invalid id format: ${id}`);
}

/**
 * ISO 날짜 문자열을 표준 형식으로 변환
 * @param isoDate - ISO 8601 형식 날짜
 * @returns "YYYY-MM-DD HH:mm:ss" 형식
 */
export function formatDateTime(isoDate: string): string {
    if (!isoDate) return "";

    try {
    // 2026-01-15T08:30:00.000Z
    // 2026-01-15T08:30:00Z
        const m = isoDate.match(
            /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})/
        );

        if (!m) return isoDate;

        return `${m[1]} ${m[2]}`;
    } catch {
        return isoDate;
    }
}


/**
 * 날짜 문자열 파싱
 * @param date - 날짜 문자열 또는 Date 객체
 * @returns Date 객체
 */
export function parseDate(date: string | Date): Date {
    if (date instanceof Date) {
        return date;
    }

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
    }

    return parsed;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 날짜를 ISO 8601 형식으로 포맷 (UTC)
 */
export function formatDateISO(date: Date): string {
    return date.toISOString().replace(".000Z", "Z");
}

/**
 * 날짜에 일수 추가/감소
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * 국가명을 ISO 코드로 변환하는 맵
 */
export const COUNTRY_CODE_MAP: Record<string, string> = {
    England: "GB-ENG",
    Spain: "ES",
    Germany: "DE",
    Italy: "IT",
    France: "FR",
    Portugal: "PT",
    Netherlands: "NL",
    Belgium: "BE",
    Turkey: "TR",
    Scotland: "GB-SCT",
    Austria: "AT",
    Switzerland: "CH",
    Greece: "GR",
    "Czech-Republic": "CZ",
    Denmark: "DK",
    Norway: "NO",
    Sweden: "SE",
    Poland: "PL",
    Ukraine: "UA",
    Russia: "RU",
    Croatia: "HR",
    Serbia: "RS",
    Slovakia: "SK",
    Bulgaria: "BG",
    Romania: "RO",
    Hungary: "HU",
    Israel: "IL",
    Cyprus: "CY",
    Azerbaijan: "AZ",
    Kazakhstan: "KZ",
    Slovenia: "SI",
    Finland: "FI",
    Ireland: "IE",
    "Northern-Ireland": "GB-NIR",
    Wales: "GB-WLS",
    Albania: "AL",
    Bosnia: "BA",
    Montenegro: "ME",
    "North-Macedonia": "MK",
    Moldova: "MD",
    Lithuania: "LT",
    Latvia: "LV",
    Estonia: "EE",
    Georgia: "GE",
    Armenia: "AM",
    Belarus: "BY",
    Iceland: "IS",
    "Faroe-Islands": "FO",
    Luxembourg: "LU",
    Malta: "MT",
    Andorra: "AD",
    "San-Marino": "SM",
    Liechtenstein: "LI",
    Gibraltar: "GI",
    "South-Korea": "KR",
    Japan: "JP",
    China: "CN",
    Australia: "AU",
    USA: "US",
    Mexico: "MX",
    Brazil: "BR",
    Argentina: "AR",
    World: "XW"
};

/**
 * 국가명을 ISO 코드로 변환
 */
export function getCountryCode(countryName: string): string {
    return COUNTRY_CODE_MAP[countryName] || countryName.toUpperCase().slice(0, 2);
}
