"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRelativeDate = parseRelativeDate;
exports.parseRelativeType = parseRelativeType;
exports.parseMatchState = parseMatchState;
exports.parseMatchDate = parseMatchDate;
/* eslint-disable @stylistic/no-mixed-operators */
function parseRelativeDate(dateStr) {
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
        const [_, year, month, day] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
    if (m) {
        const [_, year, month, day] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (m) {
        const [_, year, month, day] = m;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    m = dateStr.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) {
        const [_, year, month, day] = m;
        return `${year}-${month}-${day}`;
    }
    // MM/DD 또는 MM.DD -> 현재 연도 사용
    m = dateStr.trim().match(/^(\d{1,2})[/.](\d{1,2})$/);
    if (m) {
        const [_, month, day] = m;
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
function parseRelativeType(typeStr) {
    if (!typeStr) {
        return typeStr;
    }
    const highlightList = ["H/L", "하이라이트", "HL", "5분 하이라이트", "풀 하이라이트", "2분 하이라이트"];
    const replayList = ["풀영상", "전체보기", "다시보기"];
    if (highlightList.includes(typeStr)) {
        return "highlight";
    }
    if (replayList.includes(typeStr) || replayList.includes(typeStr.toLowerCase())) {
        return "replay";
    }
    return typeStr;
}
function parseMatchState(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("next") || statusLower.includes("예정")) {
        return "next";
    }
    else if (statusLower.includes("off") || statusLower.includes("취소")) {
        return "off";
    }
    else if (statusLower.includes("end") || statusLower.includes("종료")) {
        return "end";
    }
    else if (statusLower.includes("세트") || statusLower.includes("live") || statusLower.includes("라이브")) {
        return "live";
    }
    else {
        return "live"; // 기본값
    }
}
function parseMatchDate(dateStr, timeStr) {
    try {
        // 시간 문자열 정규화
        const normalizeTime = (raw) => {
            if (!raw)
                return "00:00:00";
            const t = raw.trim();
            // 공백 제거된 "경기 시간18:30" / "경기시간18:30" 대응
            // 한글/공백 제거 후 첫 시간 패턴만 추출
            // 1) "18:30" 또는 "18:30:45"
            let m = t.match(/(\d{1,2}:\d{2}(:\d{2})?)/);
            if (m) {
                const val = m[1];
                return val.length === 5 ? `${val}:00` : val;
            }
            // 2) "18시30분", "18시 30분", "18시30"
            m = t.match(/(\d{1,2})\s*시\s*(\d{1,2})\s*분?/);
            if (m) {
                const hh = m[1].padStart(2, "0");
                const mm = m[2].padStart(2, "0");
                return `${hh}:${mm}:00`;
            }
            // 3) "1830" → 18:30
            m = t.match(/\b(\d{3,4})\b/);
            if (m) {
                const digits = m[1];
                if (digits.length === 4) {
                    return `${digits.slice(0, 2)}:${digits.slice(2)}:00`;
                }
                else if (digits.length === 3) {
                    return `0${digits[0]}:${digits.slice(1)}:00`;
                }
            }
            console.log(`시간 파싱 실패: '${raw}'`);
            return "00:00:00";
        };
        const timePart = normalizeTime(timeStr);
        let yearFromPrefix;
        let body = dateStr.trim();
        const ym = body.match(/^(\d{4})-(\d{1,2})\s+(.*)$/);
        if (ym) {
            yearFromPrefix = parseInt(ym[1], 10);
            body = ym[3].trim();
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(body)) {
            return `${body} ${timePart}`;
        }
        let month;
        let day;
        const md = body.match(/^(\d{1,2})[/.](\d{1,2})/);
        if (md) {
            month = parseInt(md[1], 10);
            day = parseInt(md[2], 10);
        }
        else {
            const kr = body
                .replace(/(\d{1,2})\s*일/, (_s, d) => `${d}일`)
                .match(/(\d{1,2})월\s*(\d{1,2})일/);
            if (kr) {
                month = parseInt(kr[1], 10);
                day = parseInt(kr[2], 10);
            }
        }
        if (month == null || day == null)
            return null;
        const year = yearFromPrefix !== null && yearFromPrefix !== void 0 ? yearFromPrefix : new Date().getFullYear();
        const datePart = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        console.log(`파싱된 날짜: '${dateStr}' -> '${datePart} ${timePart}'`);
        return `${datePart} ${timePart}`;
    }
    catch (_a) {
        return null;
    }
}
