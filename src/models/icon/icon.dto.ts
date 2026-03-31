export interface patchIconReqDto {
  userId: string;
  type: "team" | "league";
  id: number;
  uri: string;
}
