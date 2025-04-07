// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type User_Strategies = {
  id: string;
  user: string;
  strategies: [string];
};

export type latestAssignedStrategy = {
  user_id: string;
  strategy: string;
  date: string;
};

export type Assigned_Strategies = {
  id: string;
  user_id: string;
  strategy: string;
  date: string;
};
