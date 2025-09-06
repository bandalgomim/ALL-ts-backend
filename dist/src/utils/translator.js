"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRelativeDate = parseRelativeDate;
exports.parseRelativeType = parseRelativeType;
exports.parseMatchState = parseMatchState;
exports.parseMatchDate = parseMatchDate;
/* eslint-disable @typescript-eslint/no-unused-vars */
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
        let datePart = null;
        // 공백 정리: "5월 1 일 (목)" → "5월 1일 (목)"
        dateStr = dateStr.replace(/(\d{1,2})\s*일/, (m, d) => `${d}일`);
        // 1. YYYY-MM-DD 형태인지 확인
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            datePart = dateStr;
        }
        else {
            // 2. "05월 01일 (목)오늘" 형태에서 월/일 추출
            const m = dateStr.match(/(\d{1,2})월\s*(\d{1,2})일/);
            if (m) {
                const month = parseInt(m[1], 10);
                const day = parseInt(m[2], 10);
                const year = new Date().getFullYear(); // 현재 연도 사용
                datePart = `${year.toString().padStart(4, "0")}-${month
                    .toString()
                    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            }
            else {
                return null;
            }
        }
        // 시간 추출 (HH:mm)
        const timeMatch = timeStr.match(/(\d{1,2}:\d{2})/);
        if (!timeMatch) {
            return null;
        }
        const timePart = timeMatch[1];
        return `${datePart} ${timePart}:00`;
    }
    catch (e) {
        return null;
    }
}
