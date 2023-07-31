export interface userProfil {
  id: number;
  username: string;
  avatar_url: string;
  email: string;
  password: string;
  verification_code: number | null;
  admin: boolean;
  created_at: string;
  updated_at: string;
}
