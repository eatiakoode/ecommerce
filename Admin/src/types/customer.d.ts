export type Customer = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
  address?: string;
};
