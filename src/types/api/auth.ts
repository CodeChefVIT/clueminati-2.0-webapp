export interface signupProps {
  name: string;
  email: string;
  password: string;
  key: string;
}

export interface updateProps {
  name: string | undefined;
  password: string | undefined;
  key: string;
}
