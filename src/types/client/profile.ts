export interface UserData {
  name: string;
  email: string;
  teamId?: string;
  team?: TeamData;
}

export interface TeamData {
  name: string;
  teamCode: string;
  userCount: number;
  score: number;
  users: {
    name: string;
    email: string;
  }[];
}

export interface ApiResponse {
  message: string;
  data: UserData;
}
