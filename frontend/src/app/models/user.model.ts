export interface User {
  _id?: string;
  username: string;
  password?: string; // Optional on the frontend model
  role?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: Date;
}
