export interface createTeamProps {
  teamName: string;
}

export interface createTeamAPIProps {
  message: string;
  data: {
    name: string;
    teamCode: string;
  };
}

export interface joinTeamProps {
  teamCode: string;
}
