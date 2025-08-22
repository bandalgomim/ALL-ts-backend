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
