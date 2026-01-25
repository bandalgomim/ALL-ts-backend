/**
 * API Football - DTO 타입 정의
 */

// API Football Fixture 응답
export interface ApiFootballFixture {
    fixture: {
        id: number,
        date: string,
        status: {
            short: string
        }
    },
    teams: {
        home: { id: number, name: string },
        away: { id: number, name: string }
    },
    goals: {
        home: number | null,
        away: number | null
    },
    score?: Record<string, unknown>
}

// API Football League 응답
export interface ApiFootballLeague {
    league: {
        id: number,
        name: string,
        logo?: string
    },
    country?: {
        name: string,
        flag: string
    },
    seasons: Array<{
        year: number,
        start?: string,
        end?: string,
        current: boolean
    }>
}

// API Football Standing
export interface ApiFootballStanding {
    rank: number,
    team: {
        id: number,
        name: string,
        logo?: string
    },
    points: number,
    group: string,
    all: {
        win: number,
        draw: number,
        lose: number
    }
}

// API Football Standings 응답
export interface ApiFootballStandingsResponse {
    league: {
        standings: ApiFootballStanding[][],
        flag?: string,
        country?: string
    }
}

// API Football Team
export interface ApiFootballTeam {
    team: {
        id: number,
        name: string,
        code: string,
        country: string,
        logo: string
    }
}

export interface TeamInfo {
    team: {
        id: number,
        code: string
    }
}
