export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type UserStrategies = {
  id: string;
  user_id: string;
  strategies: [string];
};

export type LatestAssignedStrategy = {
  user_id: string;
  strategy: string;
  date: string;
};

export type AssignedStrategies = {
  id: string;
  user_id: string;
  strategy: string;
  date: string;
};
