/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @stylistic/no-mixed-operators */
export function parseRelativeDate(dateStr: string): string {
    const now = new Date();
    let m = dateStr.match(/(\d+)\s*분\s*전/);
    if (m) {
        const minutes = parseInt(m[1], 10);
        const d = new Date(now.getTime() - minutes * 60 * 1000);
        return d.toISOString().slice(0, 10);
    }
    m = dateStr.match(/(\d+)\s*시간\s*전/);
    if (m) {
        const hours = parseInt(m[1], 10);
        const d = new Date(now.getTime() - hours * 60 * 60 * 1000);
        return d.toISOString().slice(0, 10);
    }
    m = dateStr.match(/(\d+)\s*일\s*전/);
    if (m) {
        const days = parseInt(m[1], 10);
        const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        return d.toISOString().slice(0, 10);
    }
    m = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (m) {
        const [ _, year, month, day ] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
    if (m) {
        const [ _, year, month, day ] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (m) {
        const [ _, year, month, day ] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) {
        const [ _, year, month, day ] = m;
        return `${year}-${month}-${day}`;
    }

    // MM/DD 또는 MM.DD -> 현재 연도 사용
    m = dateStr.trim().match(/^(\d{1,2})[/.](\d{1,2})$/);
    if (m) {
        const [ _, month, day ] = m;
        const year = now.getFullYear();
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/(\d{1,2})월\s*(\d{1,2})일/);
    if (m) {
        const month = m[1];
        const day = m[2];
        const year = now.getFullYear();
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr;
}

export function parseRelativeType(typeStr: string | null | undefined): string | null | undefined {
    if (!typeStr) {
        return typeStr;
    }
    const highlightList = [ "H/L", "하이라이트", "HL", "5분 하이라이트", "풀 하이라이트", "2분 하이라이트" ];
    const replayList = [ "풀영상", "전체보기", "다시보기" ];

    if (highlightList.includes(typeStr)) {
        return "highlight";
    }
    if (replayList.includes(typeStr) || replayList.includes(typeStr.toLowerCase())) {
        return "replay";
    }
    return typeStr;
}

export function parseMatchState(status: string): "next" | "off" | "end" | "live" {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("next") || statusLower.includes("예정")) {
        return "next";
    } else if (statusLower.includes("off") || statusLower.includes("취소")) {
        return "off";
    } else if (statusLower.includes("end") || statusLower.includes("종료")) {
        return "end";
    } else if (statusLower.includes("세트") || statusLower.includes("live") || statusLower.includes("라이브")) {
        return "live";
    } else {
        return "live"; // 기본값
    }
}

export function parseMatchDate(dateStr: string, timeStr: string): string | null {
    try {
        let yearFromPrefix: number | undefined;
        let body = dateStr.trim();

        // "YYYY-MM ..." 접두 처리: 연도만 사용, 월은 본문에서 추출
        const ym = body.match(/^(\d{4})-(\d{1,2})\s+(.*)$/);
        if (ym) {
            yearFromPrefix = parseInt(ym[1], 10);
            body = ym[3].trim();
        }

        // 1) 이미 YYYY-MM-DD 형태면 그대로 사용
        if (/^\d{4}-\d{2}-\d{2}$/.test(body)) {
            const datePart = body;
            const timePart = /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)
                ? (timeStr.length === 5 ? `${timeStr}:00` : timeStr)
                : "00:00:00";
            return `${datePart} ${timePart}`;
        }

        // 2) MM/DD 또는 MM.DD
        let month: number | undefined;
        let day: number | undefined;

        const m = body.match(/^(\d{1,2})[/.](\d{1,2})/);
        if (m) {
            month = parseInt(m[1], 10);
            day = parseInt(m[2], 10);
        } else {
            // 3) 한글 "N월 N일"
            const kr = body
                .replace(/(\d{1,2})\s*일/, (_s, d) => `${d}일`)
                .match(/(\d{1,2})월\s*(\d{1,2})일/);
            if (kr) {
                month = parseInt(kr[1], 10);
                day = parseInt(kr[2], 10);
            }
        }

        if (month == null || day == null) return null;

        const year = yearFromPrefix ?? new Date().getFullYear();
        const datePart = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        const timePart = /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)
            ? (timeStr.length === 5 ? `${timeStr}:00` : timeStr)
            : "00:00:00";

        return `${datePart} ${timePart}`;
    } catch {
        return null;
    }
}
