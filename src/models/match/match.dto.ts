export interface platform {
  platformId: number;
  platformName: string;
  platformLeagueUrl: string;
  platformMatchUrl: string;
  platfromMatchUrlType: string;
}

export interface getMatchDto {
  matchId: string;
  matchDate: string | Date;
  matchTime: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamInit: string;
  awayTeamInit: string;
  hometeamLogo: string;
  awayteamLogo: string;
  homeTeamScore: number;
  awayTeamScore: number;
  sportName: string;
  homeCountryName: string;
  awayCountryName: string;
  homeLeagueName: string;
  awayLeagueName: string;
  matchState: string;
  isMatchSelected: boolean;
  platform: platform[];
}
