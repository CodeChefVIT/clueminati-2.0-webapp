export interface Team {
  name: string;
  code: string;
}

export interface TeamsApiResponse {
  message: string;
  data: Team[];
}
