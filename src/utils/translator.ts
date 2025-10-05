/* eslint-disable @typescript-eslint/no-unused-vars */

import { constrainedMemory } from "process";

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
    const highlightList = [ "H/L", "하이라이트", "HL", "5분 하이라이트", "풀 하이라이트", "2분 하이라이트", "3분 하이라이트" ];
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

export function parseMatchDate(dateStr: string, timeStr: string): string[] | null {
    try {
        // 시간 문자열 정규화
        const normalizeTime = (raw: string): string => {
            if (!raw) return "00:00:00";
            const t = raw.trim();
            let m = t.match(/(\d{1,2}:\d{2}(:\d{2})?)/);
            if (m) {
                const val = m[1];
                return val.length === 5 ? `${val}:00` : val;
            }
            m = t.match(/(\d{1,2})\s*시\s*(\d{1,2})\s*분?/);
            if (m) {
                const hh = m[1].padStart(2, "0");
                const mm = m[2].padStart(2, "0");
                return `${hh}:${mm}:00`;
            }
            m = t.match(/\b(\d{3,4})\b/);
            if (m) {
                const digits = m[1];
                if (digits.length === 4) {
                    return `${digits.slice(0, 2)}:${digits.slice(2)}:00`;
                } else if (digits.length === 3) {
                    return `0${digits[0]}:${digits.slice(1)}:00`;
                }
            }
            return "00:00:00";
        };

        const timePart = normalizeTime(timeStr);

        let yearFromPrefix: number | undefined;
        let prefixMonthStr: string | undefined;
        let body = dateStr.trim();

        // NEW: YYYY-MM-DD 접두어 처리 (예: "2026-01-01 1월 25일 (일)")
        const ymd = body.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(.*)$/);
        if (ymd) {
            yearFromPrefix = parseInt(ymd[1], 10);
            prefixMonthStr = ymd[2].padStart(2, "0");
            body = ymd[4].trim();
        } else {
            // 기존: YYYY-MM 접두어 처리 (예: "2026-05 5월 1일 (목)")
            const ym = body.match(/^(\d{4})-(\d{1,2})\s+(.*)$/);
            if (ym) {
                yearFromPrefix = parseInt(ym[1], 10);
                prefixMonthStr = ym[2].padStart(2, "0");
                body = ym[3].trim();
            }
        }

        // 단독 YYYY-MM-DD 형식
        if (/^\d{4}-\d{2}-\d{2}$/.test(body)) {
            return [body, timePart];
        }

        let month: number | undefined;
        let day: number | undefined;

        const md = body.match(/^(\d{1,2})[/.](\d{1,2})/);
        if (md) {
            month = parseInt(md[1], 10);
            day = parseInt(md[2], 10);
        } else {
            const kr = body
                .replace(/(\d{1,2})\s*일/, (_s, d) => `${d}일`)
                .match(/(\d{1,2})월\s*(\d{1,2})일/);
            if (kr) {
                month = parseInt(kr[1], 10);
                day = parseInt(kr[2], 10);
            }
        }

        if (month == null || day == null) return null;

        // 접두어의 월과 불일치 시 무효 처리
        if (prefixMonthStr && month.toString().padStart(2, "0") !== prefixMonthStr) {
            return null;
        }

        const year = yearFromPrefix ?? new Date().getFullYear();
        const datePart = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        return [ datePart, timePart ];
    } catch {
        return null;
    }
}
